import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats, setStats] = useState({
    monitoredMachines: 0,
    activeAlerts: 0,
    uptime: 0,
  });

  useEffect(() => {
    // Simulating data update every 2 seconds
    const interval = setInterval(() => {
      setStats({
        monitoredMachines: 4, // Example static data (can be dynamic later)
        activeAlerts: Math.floor(Math.random() * 5), // Random alerts
        uptime: (Math.random() * 99 + 1).toFixed(2), // Random uptime percentage
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-white">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-400">
          Predictive Maintenance Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-300">
          An AI-powered solution for monitoring industrial equipment in real-time.
        </p>
      </div>

      {/* Project Overview */}
      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-300">Why This Dashboard?</h2>
        <p className="mt-2 text-gray-400">
          Our system leverages AI and IoT to monitor real-time sensor data from machines like the Conveyor System, Sealing Machine, Robot Arm, and Filling Machine.
          <br />
          Get instant alerts on anomalies, track machine performance, and prevent failures before they happen.
        </p>
      </div>

      {/* Key Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-5 rounded-lg text-center shadow-md">
          <h3 className="text-xl font-semibold">📊 Monitored Machines</h3>
          <p className="text-4xl mt-2 font-bold text-blue-400">{stats.monitoredMachines}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg text-center shadow-md">
          <h3 className="text-xl font-semibold">🚨 Active Alerts</h3>
          <p className={`text-4xl mt-2 font-bold ${stats.activeAlerts > 0 ? "text-red-400" : "text-green-400"}`}>
            {stats.activeAlerts}
          </p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg text-center shadow-md">
          <h3 className="text-xl font-semibold">⚙️ System Uptime (%)</h3>
          <p className="text-4xl mt-2 font-bold text-yellow-400">{stats.uptime}%</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-400">Select a machine from the sidebar to view its real-time status.</p>
        <Link
          to="/3D-model"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
        >
          Go to 3D view 🚀
        </Link>
      </div>
    </div>
  );
};

export default Home;
