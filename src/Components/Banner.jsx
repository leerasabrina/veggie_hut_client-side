import React, { useState } from 'react';
import './component.css';


const slides = [
  {
    id: 1,
    image: 'https://i.ibb.co/7tN4kWyQ/pexels-adonyi-foto-1414651.jpg',
    title: 'Buy Fresh Vegetables from Local Markets',
    description: 'Explore verified daily prices and get your desired vegetables straight from trusted vendors in your area.',
  },
  {
    id: 2,
    image:'https://i.ibb.co/qLL9GM7L/63671.jpg',
    title: 'Track Price Trends Before You Buy',
    description: 'Visualize daily price fluctuations through interactive charts and make smarter purchase decisions at the bazaar.',
  },
  {
    id: 3,
    image: 'https://i.ibb.co/VYdxYPgz/3439702.jpg',
    title: 'Sell Your Vegetables with Confidence',
    description: 'Easily list your fresh produce and reach more customers who are actively browsing for fair market prices every day.',
  },
];

const Banner = () => {
  /* https://i.ibb.co/p65F5cJv/Screenshot-2025-07-10-133759.png
https://i.ibb.co/YFzDJfQk/Screenshot-2025-07-10-134053.png
lau Bottle gourd ladies finger

banner
https://i.ibb.co/7tN4kWyQ/pexels-adonyi-foto-1414651.jpg*/ 

  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  return (
    <div id="banner">
      <div className="carousel w-full h-[500px] relative">
        {/* Slide */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-item absolute w-full transition-opacity duration-700 ${
              index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={slide.image} className="w-full lg:h-[500px] object-cover " />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30"></div>
            <div className="absolute lg:left-[400px] lg:top-[150px] flex flex-col gap-2" key={activeSlide}>
              <h1 className="text-white text-3xl p-2 animate-slideOut">{slide.title}</h1>
              <p className="text-white p-2 text-xl animate-slideIn">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Pagination Dots */}
        {/* Pagination Dots */}
<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
  {slides.map((_, index) => {
    // Set custom color for each dot
    let baseColor = '';
    if (index === 0) baseColor = 'bg-green-800';
    else if (index === 1) baseColor = 'bg-green-600';
    else if (index === 2) baseColor = 'bg-green-400';

    return (
      <button
        key={index}
        onClick={() => handleSlideChange(index)}
        className={`w-5 h-5 rounded-full border-2 border-white transition duration-300 ${
          activeSlide === index ? 'bg-white' : baseColor
        }`}
      ></button>
    );
  })}
</div>

      </div>
    </div>
  );
};

export default Banner;
