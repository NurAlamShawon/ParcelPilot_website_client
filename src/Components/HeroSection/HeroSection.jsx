import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const HeroSection = () => {
  return (
    <Carousel infiniteLoop={true} 
    autoPlay={true} transitionTime={1000} 
    showThumbs={false} 
    showArrows={false} 
    showStatus={false} 
    showIndicators={false}
    stopOnHover={false}
    className="my-10">
      <div>
        <img src="https://i.postimg.cc/qBbTCKZC/banner1.png" />
      </div>
      <div>
        <img src="https://i.postimg.cc/7hWr8vTN/banner2.png" />
      </div>
      <div>
        <img src="https://i.postimg.cc/sDMRP2tH/banner3.png" />
      </div>
    </Carousel>
  );
};

export default HeroSection;
