import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-gray-800 text-white p-5 flex flex-col ">
      <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-4">
        <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded">
          Home
        </Link>
        <Link to="/conveyor" className="block px-4 py-2 hover:bg-gray-700 rounded">
          Conveyor System
        </Link>
        <Link to="/filling" className="block px-4 py-2 hover:bg-gray-700 rounded">
          Filling Machine
        </Link>
        <Link to="/sealing" className="block px-4 py-2 hover:bg-gray-700 rounded">
          Sealing Machine
        </Link>
        <Link to="/robot-arm" className="block px-4 py-2 hover:bg-gray-700 rounded">
          Robot Arm
        </Link>
      </nav>
      </div>
        <Link

          to="/3d-model"
          className="px-4 py-2 mb-5 bg-blue-500 hover:bg-blue-600 rounded text-center w-full mt-auto"
        >
          View 3D-Model
        </Link>
      </div>    
  );
};

export default Sidebar;
