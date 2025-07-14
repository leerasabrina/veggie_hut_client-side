
import { Link, NavLink, Outlet } from "react-router";
import '../page.css';
import Logo from "../../Components/Logo";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { ToastContainer } from "react-toastify";

const DashboardSeller = () => {
  
  return (
    <>
    <Navbar></Navbar>
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className='w-64 p-4 mt-4 bg-white shadow-2xl'>
      
        <ul>
           <li><NavLink to="/dashboard-seller/add-adv" className='a'>Add  Advertisement</NavLink></li>
           <li><NavLink to="/dashboard-seller/my-advs" className='a'>My  Advertisements</NavLink></li>
          <li><NavLink to="/dashboard-seller/add-item" className='a'>Add Product</NavLink></li>
          <li><NavLink to="/dashboard-seller/my-items" className='a'>My Products</NavLink></li>
        </ul>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
    <Footer></Footer>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default DashboardSeller;
