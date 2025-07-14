import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './component.css'
import { motion } from 'framer-motion';


const Newsletter = () => {
  const [email, setEmail] = useState('');
  

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      toast.error('Please enter a valid email!');
      return;
    }
    toast.success('Subscribed Successfully!');
    setEmail('');
  };

  return (
    <div className="max-w-6xl mx-auto my-20 border border-gray-100 shadow-md p-8 rounded-lg text-center  ">
        <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-6 text-green-700"
      >
       Subscribe to our Newsletter
      </motion.h2>
     
      <p className="mb-6 text-gray-600">
        Get updates about  tasks directly in your inbox.
      </p>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2 md:flex-row  items-center justify-center">
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-md  border  border-gray-300 w-72"
          required
        />
        <button 
          type="submit"
          className="bg-[#007c00] hover:bg-blue-400 text-white rounded-lg px-6 py-3  transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;