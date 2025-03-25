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

// Create a single socket instance to be reused
const socket = io("http://localhost:5069");

const Conveyor = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    vibration: "--",
    pressure: "--",
    lastUpdated: "--",
  });

  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(true);

  const [maintenanceDue, setMaintenanceDue] = useState(true);
  const [daysUntilMaintenance, setDaysUntilMaintenance] = useState(30);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to server");
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const handleConveyorData = (data) => {
      console.log("Received conveyor data:", data);
      setSensorData(data);

      setChartData((prevData) => {
        const updatedData = [...prevData, { ...data, time: data.lastUpdated }];
        return updatedData.length > 10 ? updatedData.slice(-10) : updatedData;
      });

      checkAlerts(data);
    };

    socket.on("conveyorData", handleConveyorData);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("conveyorData", handleConveyorData);
    };
  }, []);

  const checkAlerts = (data) => {
    let newAlerts = [];

    if (parseFloat(data.temperature) > 100)
      newAlerts.push("🔥 High Temperature Alert: Over 100°C");
    if (parseFloat(data.vibration) > 5.0)
      newAlerts.push("⚠️ Critical Vibration Alert: Over 5.0");
    if (parseFloat(data.pressure) > 180)
      newAlerts.push("⚠️ High Pressure Alert: Over 180 psi");

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
      setDaysUntilMaintenance(30);
    }
  };

  const handleAlertToggle = () => {
    setShowMaintenanceAlert(!showMaintenanceAlert);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Conveyor System</h1>
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
        <div
          className={`p-4 rounded-lg text-center ${
            parseFloat(sensorData.temperature) > 100 ? "bg-red-500" : "bg-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Temperature</h3>
          <p className="text-3xl mt-2">{sensorData.temperature}°C</p>
        </div>
        <div
          className={`p-4 rounded-lg text-center ${
            parseFloat(sensorData.vibration) > 5.0 ? "bg-red-500" : "bg-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Vibration</h3>
          <p className="text-3xl mt-2">{sensorData.vibration}</p>
        </div>
        <div
          className={`p-4 rounded-lg text-center ${
            parseFloat(sensorData.pressure) > 180 ? "bg-red-500" : "bg-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Pressure</h3>
          <p className="text-3xl mt-2">{sensorData.pressure} psi</p>
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
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ff7300"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="vibration"
              stroke="#1e90ff"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#32cd32"
              strokeWidth={2}
            />
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
              ⚠️ Your Conveyor System requires maintenance. {daysUntilMaintenance} days left.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-gray-500 text-sm">
        Last updated: {sensorData.lastUpdated}
      </p>
    </div>
  );
};

export default Conveyor;