'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

function ImageSlider({ children }: { children: React.ReactNode }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener to track window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const settings = {
    infinite: true,
    centerPadding: '60px',
    slidesToShow: screenWidth < 1300 ? 4 : 5,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 6000,
    cssEase: 'linear',
    swipeToSlide: true,
    afterChange: function (index: number) {
      console.log(`Slider Changed to: ${index + 1}, background: #222; color: #bada55`);
    },
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}

export default ImageSlider;
