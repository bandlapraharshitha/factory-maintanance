const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust if frontend runs on another port
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Function to generate Conveyor Machine data
  const generateConveyorData = () => ({
    temperature: (Math.random() * (80 - 30) + 30).toFixed(2), // 30°C - 80°C
    vibration: (Math.random() * (10 - 1) + 1).toFixed(2), // 1 - 10
    pressure: (Math.random() * (200 - 50) + 50).toFixed(2), // 50 - 200
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Function to generate Robot Arm data
  const generateRobotArmData = () => ({
    jointAngle: (Math.random() * (180 - 0) + 0).toFixed(2), // 0° - 180°
    torque: (Math.random() * (60 - 5) + 5).toFixed(2), // 5 - 60 Nm
    speed: (Math.random() * (2000 - 500) + 500).toFixed(2), // 500 - 2000 RPM
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Function to generate Sealing Machine data
  const generateSealingData = () => ({
    temperature: (Math.random() * (250 - 100) + 100).toFixed(2), // 100°C - 250°C
    sealingPressure: (Math.random() * (120 - 50) + 50).toFixed(2), // 50 - 120 PSI
    speed: (Math.random() * (5000 - 1000) + 1000).toFixed(2), // 1000 - 5000 RPM
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Function to generate Filling Machine data
  const generateFillingData = () => ({
    fillLevel: (Math.random() * (100 - 0) + 0).toFixed(2), // 0% - 100%
    flowRate: (Math.random() * (50 - 10) + 10).toFixed(2), // 10 - 50 L/min
    temperature: (Math.random() * (60 - 10) + 10).toFixed(2), // 10°C - 60°C
    lastUpdated: new Date().toLocaleTimeString(),
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Move these outside the connection callback to emit to all clients
// Use io.emit instead of socket.emit to broadcast to all connected clients
setInterval(() => {
  io.emit("conveyorData", generateConveyorData());
}, 2000);

setInterval(() => {
  io.emit("sealingData", generateSealingData());
}, 2000);

setInterval(() => {
  io.emit("fillingData", generateFillingData());
}, 2000);

setInterval(() => {
  io.emit("robotArmData", generateRobotArmData());
}, 2000);

// Define the functions outside the connection callback so they can be used by the intervals
function generateConveyorData() {
  return {
    temperature: (Math.random() * (80 - 30) + 30).toFixed(2), // 30°C - 80°C
    vibration: (Math.random() * (10 - 1) + 1).toFixed(2), // 1 - 10
    pressure: (Math.random() * (100 - 50) + 50).toFixed(2), // 100 - 300
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

function generateRobotArmData() {
  return {
    jointAngle: (Math.random() * (180 - 0) + 0).toFixed(2), // 0° - 180°
    torque: (Math.random() * (60 - 5) + 5).toFixed(2), // 5 - 60 Nm
    speed: (Math.random() * (2000 - 500) + 500).toFixed(2), // 500 - 2000 RPM
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

function generateSealingData() {
  return {
    temperature: (Math.random() * (250 - 100) + 100).toFixed(2), // 100°C - 250°C
    sealingPressure: (Math.random() * (120 - 50) + 50).toFixed(2), // 50 - 120 PSI
    speed: (Math.random() * (5000 - 1000) + 1000).toFixed(2), // 1000 - 5000 RPM
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

function generateFillingData() {
  return {
    fillLevel: (Math.random() * (100 - 0) + 0).toFixed(2), // 0% - 100%
    flowRate: (Math.random() * (50 - 10) + 10).toFixed(2), // 10 - 50 L/min
    temperature: (Math.random() * (60 - 10) + 10).toFixed(2), // 10°C - 60°C
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

server.listen(5069, () => {
  console.log("Server running on http://localhost:5069");
});