import React, { useContext } from 'react';
import { FaFacebookF,FaTwitter, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
// import { PiBookOpenDuotone } from "react-icons/pi";
import './component.css'
import Logo from './Logo';




const Footer = () => {
  
    return (
      <footer className="bg-slate-800 text-white py-10 ">
      
      <div className="max-w-6xl space-y-8 mx-auto px-4 grid grid-cols-1 md:grid-cols-4 md:gap-20">
        <div>
          <Logo></Logo>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center gap-2 mb-2"><FaMapMarkerAlt /> Dhaka, Bangladesh</p>
          <p className="flex  items-center gap-2 mb-2"><FaPhoneAlt /> +880 1234-567890</p>
          {/* @ er pore logo name dibo */}
          <p className="flex  items-center gap-2"><FaEnvelope /> support@veggiehut.com</p>
        </div>

       
        <div>
          <h3 className="text-xl font-semibold mb-4">Legal</h3>
          <ul>
            <li className="mb-2 hover:text-blue-400 cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 a"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 a"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 a"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
      {/* Virtual er jaygay logoname */}

      <div className="text-center mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Virtual Vegetable Shop. All rights reserved.
      </div>
    </footer>
    );
};

export default Footer;