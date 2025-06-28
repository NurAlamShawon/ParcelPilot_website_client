import React from 'react';

const ResetPass = () => {
    return (
       <div className="w-full xl:flex flex-row">
    {/* left div */}
      <div className="xl:w-1/2 w-full max-w-md mx-auto mt-10 p-6 border rounded shadow my-5">
        {/* <h2 className="text-xl font-bold mb-4 text-center">
          Enter Verification Code
        </h2>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
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
        </button> */}
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

export default ResetPass;