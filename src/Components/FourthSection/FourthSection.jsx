import React from "react";
import Marquee from "react-fast-marquee";

const FourthSection = () => {
  return (
    <div className="max-w-7xl mx-auto  my-30">
      <h1 className="text-3xl font-bold  mb-20 text-center rancho text-[#03373D]">
        We've helped thousands of sales teams
      </h1>

      <Marquee
        gradient={true}
    
        gradientWidth={30} // smaller width for lighter gradient
        speed={60}
      >
        <img
          src="https://i.postimg.cc/3w6f0sPV/amazon.png"
          alt=""
          className="h-8 mr-8"
        />
        <img
          src="https://i.postimg.cc/MHJsdyZY/casio.png"
          alt=""
          className="h-8 mr-8"
        />
        <img
          src="https://i.postimg.cc/Qdfyh9SX/moonstar.png"
          alt=""
          className="h-8 mr-8"
        />
        <img
          src="https://i.postimg.cc/tCtcvmxn/randstad.png"
          alt=""
          className="h-8 mr-8"
        />
        <img
          src="https://i.postimg.cc/nLMwzFwq/start.png"
          alt=""
          className="h-8 mr-8"
        />
        <img
          src="https://i.postimg.cc/T3d4zqV7/start-people-1.png"
          alt=""
          className="h-8 mr-8"
        />
        <img
          src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
          alt="Google"
          className="h-12 mx-8"
        />
        <img
          src="https://i.postimg.cc/JhDVF5mw/image.png"
          alt="Apple"
          className="h-12 mx-8"
        />
        <img
          src="https://i.postimg.cc/3J1T0w9q/image.png"
          alt="Apple"
          className="h-12 mx-8"
        />
      </Marquee>
    </div>
  );
};

export default FourthSection;
