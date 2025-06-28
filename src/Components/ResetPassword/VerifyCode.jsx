import React, { useContext, useRef, useState } from "react";
import { ValueContext } from "../../Context/ValueContext";
import { useNavigate } from "react-router";

const VerifyCode = () => {
  const { code } = useContext(ValueContext);
  const [codes, setCodes] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...codes];
      newCode[index] = value;
      setCodes(newCode);

      // Move to next input if not last
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pasteData)) return;

    const newCode = pasteData.split("");
    setCodes(newCode);
    newCode.forEach((digit, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx].value = digit;
      }
    });
    inputsRef.current[5].focus();
  };

  const handleVerify = () => {
    const fullCode = codes.join("");
    if (fullCode.length === code) {
      navigate("/authentication/reset-pass");
    } else {
      alert("Code not match!");
    }
  };

  return (
    <div className="w-full xl:flex flex-row">
      {/* left div */}
      <div className="xl:w-1/2 w-full max-w-md mx-auto mt-10 p-6 border rounded shadow my-5">
        <h2 className="text-xl font-bold mb-4 text-center">
          Enter Verification Code
        </h2>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {codes.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-2xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Verify Code
        </button>
      </div>

      {/* right div */}
      <div className="xl:w-1/2 w-full bg-[#FAFDF0] border-2 border-gray-200">
        <img
          src="https://i.postimg.cc/fWpYV7kk/auth-Image.png"
          alt=""
          className="mx-auto mt-20"
        />
      </div>
    </div>
  );
};

export default VerifyCode;
