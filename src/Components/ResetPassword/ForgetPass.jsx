import React, { useContext } from "react";
import { Link } from "react-router";
import { ValueContext } from "../../Context/ValueContext";
import emailjs from "emailjs-com";

const ForgetPass = () => {
  const { setcode } = useContext(ValueContext);
  

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  setcode(code);

  const sendOTP = async (email, code) => {
    try {
      const result = await emailjs.send(
        "service_dgxxjyg",
        "oD_t0YbtDu5aPab7pBzY_",
        {
          email: email,
          code: code,
        },
        "your_user_id" // public key
      );
      console.log(result.text);
      alert("Code sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send code.");
    }
  };

  const handlecode = async (e) => {
    e.preventDefault();
    const email = e.target.email;
    console.log(email)
    sendOTP(email, code);
  };

  return (
    <div className="w-full xl:flex flex-row">
      {/* left side */}
      <div className="xl:w-1/2 w-full bg-white  shrink-0 shadow-2xl border-2 border-gray-200">
        <div className="max-w-xl mx-auto">
          <form className="space-y-6  xl:m-20 m-10" onSubmit={handlecode}>
            <h1 className="font-semibold text-2xl text-center">Welcome Back</h1>
            <p className="text-center text-base">Login with ParcelPilot</p>
            <div className="border-1 border-gray-200 mx-2"></div>
            <label>Email Address</label>
            <br></br>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="input w-full"
            />

            <br></br>
            <Link to="/authentication/verify-code">
              <input
                type="submit"
                value="Send"
                className="text-white btn bg-[#0096db] w-full"
              />
            </Link>

            <br></br>

            <div>
              {" "}
              <p className="font-semibold text-base text-black text-center">
                Remember your password?
                <Link to="/authentication" className="text-[#f77b33] pl-2">
                  Login
                </Link>{" "}
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* right side */}
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

export default ForgetPass;
