import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Conveyor from "./pages/Conveyor";
import Filling from "./pages/Filling";
import Sealing from "./pages/Sealing";
import RobotArm from "./pages/RobotArm";
import ModelViewer from "./pages/ModelViewer";


function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-grow p-6 overflow-y-auto h-screen flex-1 bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conveyor" element={<Conveyor />} />
          <Route path="/filling" element={<Filling />} />
          <Route path="/sealing" element={<Sealing />} />
          <Route path="/robot-arm" element={<RobotArm />} />
          <Route path="/3d-model" element={<ModelViewer/>}/>
        </Routes>
      </div>
    </div>
  );
}
export default App;
