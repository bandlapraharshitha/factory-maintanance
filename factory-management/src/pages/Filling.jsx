import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const socket = io("http://localhost:5069");

const Filling = () => {
  const [sensorData, setSensorData] = useState({
    fillLevel: "--",
    flowRate: "--",
    temperature: "--",
    lastUpdated: "--",
  });

  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(true);

  const [maintenanceDue, setMaintenanceDue] = useState(true);
  const [daysUntilMaintenance, setDaysUntilMaintenance] = useState(25); // Adjusted days

  useEffect(() => {
    socket.on("fillingData", (data) => {
      console.log("Received filling machine data:", data);
      setSensorData(data);

      setChartData((prevData) => {
        const updatedData = [...prevData, { ...data, time: data.lastUpdated }];
        return updatedData.length > 10 ? updatedData.slice(1) : updatedData;
      });

      checkAlerts(data);
    });

    return () => {
      socket.off("fillingData");
    };
  }, []);

  const checkAlerts = (data) => {
    let newAlerts = [];

    if (data.fillLevel > 95) newAlerts.push("⚠️ High Fill Level Alert: Over 95%");
    if (data.flowRate > 45) newAlerts.push("🔥 High Flow Rate Alert: Over 45 L/min");
    if (data.temperature > 50) newAlerts.push("⚠️ High Temperature Alert: Over 50°C");

    setAlerts(newAlerts);
  };

  useEffect(() => {
    if (maintenanceDue && daysUntilMaintenance > 0) {
      const interval = setInterval(() => {
        setDaysUntilMaintenance((prevDays) => prevDays - 1);
      }, 1000 * 60 * 60 * 24);

      return () => clearInterval(interval);
    }
  }, [maintenanceDue, daysUntilMaintenance]);

  const handleMaintenanceToggle = () => {
    setMaintenanceDue(!maintenanceDue);
    if (!maintenanceDue) {
      setDaysUntilMaintenance(25); // Reset with adjusted days
    }
  };

  const handleAlertToggle = () => {
    setShowMaintenanceAlert(!showMaintenanceAlert);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Filling Machine</h1>
      <p className="mt-2 text-gray-400">Live sensor data updates every 2 seconds.</p>

      {alerts.length > 0 && (
        <div className="mt-4 bg-red-600 text-white p-3 rounded-lg">
          <h3 className="text-lg font-semibold">🚨 ALERTS 🚨</h3>
          <ul className="mt-2">
            {alerts.map((alert, index) => (
              <li key={index} className="text-sm">{alert}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 mt-5">
        <div className={`p-4 rounded-lg text-center ${sensorData.fillLevel > 95 ? "bg-red-500" : "bg-gray-800"}`}>
          <h3 className="text-lg font-semibold">Fill Level</h3>
          <p className="text-3xl mt-2">{sensorData.fillLevel}%</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${sensorData.flowRate > 45 ? "bg-red-500" : "bg-gray-800"}`}>
          <h3 className="text-lg font-semibold">Flow Rate</h3>
          <p className="text-3xl mt-2">{sensorData.flowRate} L/min</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${sensorData.temperature > 50 ? "bg-red-500" : "bg-gray-800"}`}>
          <h3 className="text-lg font-semibold">Temperature</h3>
          <p className="text-3xl mt-2">{sensorData.temperature}°C</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Sensor Data Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#bbb" />
            <YAxis stroke="#bbb" />
            <Tooltip />
            <Line type="monotone" dataKey="fillLevel" stroke="#ff7300" strokeWidth={2} />
            <Line type="monotone" dataKey="flowRate" stroke="#1e90ff" strokeWidth={2} />
            <Line type="monotone" dataKey="temperature" stroke="#32cd32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Maintenance Status</h3>
          <button
            onClick={handleMaintenanceToggle}
            className={`p-2 rounded-lg ${
              maintenanceDue ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {maintenanceDue ? "Maintenance Done" : "Maintenance Due"}
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-400">Maintenance Alert:</p>
            <button
            onClick={handleAlertToggle}
            className={`p-2 rounded-full w-15 ${
              showMaintenanceAlert ? "bg-blue-500" : "bg-gray-600"
            }`}
          >
            {showMaintenanceAlert ? "On" : "Off"}
          </button>
        </div>
        {maintenanceDue && showMaintenanceAlert && (
          <div className="mt-4 bg-yellow-600 text-white p-3 rounded-lg">
            <p className="font-medium">
              ⚠️ Your Filling Machine requires maintenance. {daysUntilMaintenance} days left.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-gray-500 text-sm">Last updated: {sensorData.lastUpdated}</p>
    </div>
  );
};

export default Filling;