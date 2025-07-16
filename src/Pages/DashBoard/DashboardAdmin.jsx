
import { Link, NavLink, Outlet } from "react-router";
import '../page.css';
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { ToastContainer } from "react-toastify";

const DashboardAdmin = () => {
  
  return (
    <>
    <Navbar></Navbar>
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className='w-64 py-8 px-4 lg:pt-8 bg-white shadow-2xl'>
       
      
        <ul className="space-y-4">
           <li><NavLink to="/dashboard-admin/all-user" className='a' >All users</NavLink></li>
           <li><NavLink to="/dashboard-admin/all-product" className='a'>All products</NavLink></li>
          <li><NavLink to="/dashboard-admin/all-adv" className='a'>All  Advertisements</NavLink></li>
          <li><NavLink to="/dashboard-admin/all-order" className='a'>All Orders</NavLink></li>
        </ul>
      </aside>

      {/* Content Area */}
      <main className="flex-1 ">
        <Outlet />
      </main>
    </div>
    <Footer></Footer>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default DashboardAdmin;
