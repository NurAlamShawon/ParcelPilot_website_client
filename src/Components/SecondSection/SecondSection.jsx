import React, { useEffect, useState } from "react";
import { Truck } from "lucide-react";

const SecondSection = () => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch("/SecondSectionCard.json")
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch((err) => console.error("Error fetching features:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto xl:my-30 my-10">
        <h1 className="raleway text-blue-900 text-2xl font-bold mb-10">How it Works</h1>
     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center hover:shadow-xl transition-shadow"
            >
              <Truck className="h-12 w-12 text-blue-500 mb-4" />
              <h2 className="text-gray-600 text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
       
      </div>
    </div>
  );
};

export default SecondSection;
