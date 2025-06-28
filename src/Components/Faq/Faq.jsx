import React, { useEffect, useState } from "react";

const Faq = () => {
  const [faq, setfaq] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchfaq = async () => {
      const res = await fetch("/Faq.json");
      const data = await res.json();
      setfaq(data);
    };
    fetchfaq();
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-30">
      <div className="space-y-3 mb-10">
        <h1 className="text-center text-4xl text-[#03373D] font-extrabold">
          Frequently Asked Question (FAQ)
        </h1>
        <p className="text-center text-[#606060] text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      <div>
        {faq.map((item, index) => {
          return (
            <div
              key={index}
              className={`collapse collapse-arrow border border-base-300 cursor-pointer ${
                selectedIndex === index
                  ? "bg-[#E6F2F3] text-black"
                  : "bg-base-100"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title font-semibold">
                {item.question}
              </div>
              <div className="collapse-content text-sm">{item.answer}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;
