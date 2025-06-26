import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router";
import { auth } from "../../../src/firebase-init";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { ValueContext } from '../../Context/ValueContext';
import GoogleSignIn from '../GoogleSignIn/GoogleSignIn';

const Registration = () => {
    const { signupwithemail } = useContext(ValueContext);
  const [eye, seteye] = useState(false);
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const createaccountwithpassword = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const name = e.target.name.value;
    const password = e.target.password.value;
    const photo = e.target.photo.value;
    const check = e.target.check.checked;

    seterror("");

    if (!check) {
      seterror("Check the Terms and Condition Feild");
      return;
    }

    const passcheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (passcheck.test(password) === false) {
      seterror(
        "Password must contain one Upperletter one Lowerletter one symbol and a digit"
      );
      return;
    }

    signupwithemail(email, password)
      .then(() => {
        // const user = userCredential.user;
        // console.log(user);
        // verification code
        sendEmailVerification(auth.currentUser)
          .then(() => {
            alert("Verification email sent. Please check your inbox.");
            // Optionally sign out the user until they verify
          })
          .catch((err) => {
            console.log("Email verification error:", err);
          });

        // update user
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photo,
        })
          .then(() => {
            // console.log("profile updated", result);
          })
          .catch((error) => {
            console.log(error);
            seterror(error.message);
          });

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        seterror(error.message);
      });
  };

  return (
    <div className="card bg-white  max-w-3xl shrink-0 shadow-2xl mx-auto">
      <div>
        <form className="space-y-6  m-20 " onSubmit={createaccountwithpassword}>
          <h1 className="font-semibold text-2xl text-center">
            Register your account
          </h1>
          <div className="border-1 border-gray-200 mx-2"></div>
          <label for="name">Your Name</label>
          <br></br>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="input w-full"
          />
          <br></br>
          <label for="photo">Photo URL</label>
          <br></br>
          <input
            type="text"
            name="photo"
            placeholder="Enter your photo url"
            className="input w-full"
          />
          <br></br>
          <label for="email">Email</label>
          <br></br>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="input w-full"
          />
          <br></br>
          <label for="password">Password</label>
          <br></br>
          <div className=" flex relative">
            <input
              type={eye ? "text" : "password"}
              name="password"
              className="input pr-10 w-full"
              placeholder="Password"
            />
            <button
              className="absolute right-2 top-2 "
              type="button"
              onClick={() => {
                seteye(!eye);
              }}
            >
              {eye ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
          </div>
          <br></br>

          <label className="label">
            <input type="checkbox" name="check" className="checkbox" />
            Accept <span className="font-semibold">Term & Conditions</span>
          </label>
          <br></br>

          <input
            type="submit"
            value="Register"
            className="text-white btn bg-primary w-full"
          />
          <p className="font-semibold text-base text-black">
            Go to
            <Link to="/authentication" className="text-red-500 pl-2">
              Login?
            </Link>{" "}
          </p>
          <div>
            <p className="text-red-500  text-base"> {error ? error : ""}</p>
          </div>

         <GoogleSignIn></GoogleSignIn>
        </form>
      </div>
    </div>
  );

};

export default Registration;