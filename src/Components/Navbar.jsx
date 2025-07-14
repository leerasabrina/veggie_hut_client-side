import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import './component.css';
// import { PiBookOpenDuotone } from 'react-icons/pi';
import Loader from '../Loader/Loader';
import { AuthContext } from '../Contexts/AuthContext';
import Logo from './Logo';



const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
 
  const [show, setShow] = useState(false);
  const navlinks = <>
  <li><NavLink to={'/'} className='a'>Home</NavLink></li>
  <li><NavLink to={'/all'} className='a'>All Products</NavLink></li>
  

  </>

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div className= "bg-slate-100/50 px-4 text-black navbar sticky top-0 z-50">
      <div className="navbar-start w-[170px] md:w-1/2">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3  w-52 shadow">
           
            {navlinks}
          </ul>
        </div>

        {/* logo */}
        <Logo></Logo>

      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal  color">
          {navlinks}
        </ul>
      </div>
{/* end */}
      <div className="navbar-end space-x-2">

        {loading && (
          <div className= "bg-white text-black">
            <Loader></Loader>

          </div>
        )}
{user && user.photoURL && (
  <div className="flex items-center gap-2 relative">
    {/* Avatar */}
    <div
      className="w-10 h-10 rounded-full border-2 border-blue-600 cursor-pointer"
      title={user.displayName}
      onClick={() => setShow(!show)}
    >
      <img
        src={user.photoURL}
        alt="user"
        className="w-10 h-10 object-cover rounded-full"
      />
    </div>

    <button
      onClick={handleLogout}
      className="btn  bg-red-100 text-red-500 border border-red-500 hover:bg-red-300 "
    >
      Logout
    </button>

  
    {show && (
      <div className="absolute bg-white border right-0 top-12 w-56 rounded-lg shadow-lg p-4 z-50 transition-all duration-300">
        <p><strong>Name:</strong> {user.displayName}</p>
      </div>
    )}
  </div>
)}
{user && (
      <>
        {user.role === 'vendor' ? (
          <button>
            <Link to="/dashboard-seller" className="btn  text-[#007c00] border border-[#007c00] bg-white hover:bg-green-300">Dashboard</Link>
          </button>
        ) : user.role === 'admin' ? (
          <button>
            <Link to="/dashboard-admin" className="btn text-[#007c00] border border-[#007c00] bg-white hover:bg-green-300"> Dashboard</Link>
          </button>
        ) : (
          <button>
            <Link to="/dashboard" className="btn text-[#007c00] border border-[#007c00] bg-white hover:bg-green-300">Dashboard</Link>
          </button>
        )}
      </>
    )}





        {!user && (
          <>
            <Link to={'/signup'} className="btn w-[120px] bg-orange-600  text-white text-lg">Sign Up</Link>
            <Link to="/signin" className="btn bg-orange-600 w-[120px] text-white text-lg">
              Sign In
            </Link></>
        )}

        
        {/* sesh */}
      </div>
    </div>
  );
};

export default Navbar;