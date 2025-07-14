import { useContext } from "react";
import { Navigate } from "react-router";

import { motion } from "framer-motion";
import { AuthContext } from "../Contexts/AuthContext";

const PrivateUser = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
  if (!user) return <Navigate to="/signin" />;
  return children;
};

export default PrivateUser;
