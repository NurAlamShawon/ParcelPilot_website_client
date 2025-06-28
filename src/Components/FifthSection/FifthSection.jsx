import React, { useEffect, useState } from "react";

const FifthSection = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("../../../public/FifthSectionCard.json")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Error fetching cards:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-20 my-30 border-t-2 border-b-2 border-[#03464D] border-dashed">
      {cards.map((card, index) => (
        
          <div key={index} className="xl:p-8 p-4 rounded-2xl flex bg-white items-center justify-between mb-5">
            <div>
              <img src={card.image} alt="" className="xl:max-w-48 max-w-24" />
            </div>
            <div className="border-l-2 border-dashed border-[#03464D] mx-8 xl:h-32 h-44"></div>
            <div> 
              <h1 className="text-xl text-[#03373D] font-extrabold">{card.title}</h1>
              <p className="text-base text-[#606060] font-medium">{card.description}</p>
            </div>
          </div>
      
      ))}
    </div>
  );
};

export default FifthSection;
