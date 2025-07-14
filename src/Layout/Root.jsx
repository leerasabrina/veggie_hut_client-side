import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';

import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import Loader from '../Loader/Loader.jsx';

const Root = () => {
    const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); 

    return () => clearTimeout(timer);
  }, [location.pathname]);


    return (
        <div className='min-h-screen'>
        
        <Navbar></Navbar>
       
        {loading ? <Loader /> : <Outlet />}
       <Footer></Footer>
       <ToastContainer position="top-center" autoClose={2000} />
       
        
        </div>
    );
};

export default Root;