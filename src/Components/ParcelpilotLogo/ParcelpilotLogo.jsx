import React from 'react';
import { Link } from 'react-router';

const ParcelpilotLogo = () => {
    return (
        <div>
            <Link to="/">
            {" "}
            <div className="flex items-center">
              <img
                src="https://i.postimg.cc/C588y0RG/image.png"
                alt=""
                className="xl:w-15 xl:h-15 w-10 h-10"
              />
              <div>
                <p className="text-lg xl:text-2xl font-bold -ml-2 text-[#0096db]">
                  Parcel
                  <span className="text-[#f77b33]">Pilot</span>
                </p>
              </div>
            </div>
          </Link>
            
        </div>
    );
};

export default ParcelpilotLogo;