import React from 'react';
import './component.css';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const features = [
    { title: "Daily Price Updates", desc: "Stay informed with real-time market price changes." },
    { title: "Verified Vendors", desc: "We only list trusted and approved local sellers." },
    { title: "Compare Markets", desc: "Easily compare prices from different local markets." },
    { title: "Fast & Easy", desc: "User-friendly interface for quick browsing." },
  ];

  return (
    <div className="max-w-6xl mx-auto my-16 px-4 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-6 text-green-700"
      >
        Why Choose Our Site?
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            viewport={{ once: true, amount: 0.2 }}
            className="p-6 transform transition duration-300 hover:scale-105 bg-white shadow-md shadow-gray-400 rounded-lg border border-[#007c00]"
          >
            <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
