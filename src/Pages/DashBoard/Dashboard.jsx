import { NavLink, Outlet } from "react-router";
import '../page.css';
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import Loader from "../../Loader/Loader";

const Dashboard = () => {
  const {loading}=useContext(AuthContext);
  
  return (
    <>
    <Navbar></Navbar>
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className='w-64 p-4 lg:pt-8 bg-white shadow-2xl'>
        <ul>
         <li><NavLink to="/dashboard/view" className='a'> View price trends</NavLink></li>
          <li><NavLink to="/dashboard/manage"className='a'> Manage watchlist</NavLink></li>
          <li><NavLink to="/dashboard/order-list"className='a'> My Order List</NavLink></li>
        </ul>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6">
          {loading ? <Loader /> : <Outlet />}
      </main>
    </div>
    <Footer></Footer>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default Dashboard;
