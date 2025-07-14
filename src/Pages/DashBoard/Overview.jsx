import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Contexts/AuthContext";

const Overview = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">👋 Welcome {user?.displayName || "User"}!</h2>
      <p className="text-gray-600">Here's a quick overview of your dashboard.</p>

      {/* Common Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Your Role</h3>
          <p className="text-green-800">{role?.toUpperCase() || "Unknown"}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Email</h3>
          <p className="text-blue-800">{user?.email}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Name</h3>
          <p className="text-blue-800">{user?.displayName}</p>
        </div>

    
      </div>

     
    </div>
  );
};



export default Overview;