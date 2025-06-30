import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { ValueContext } from "../../Context/ValueContext";
import ParcelpilotLogo from "../ParcelpilotLogo/ParcelpilotLogo";

const Navbar = () => {
  const { currentuser, signout } = useContext(ValueContext);

  const hanglegotologin = () => {
    signout();
  };

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className=" raleway">
      <div className="navbar bg-base-100 shadow-sm xl:px-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="pr-2 btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm space-y-1 dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <NavLink to={"/add-parcel"}>Add Parcel</NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to={"/track-parcel"}>Track Parcel</NavLink>
              </li>
              <li>
                <NavLink to={"/coverage"}>Coverage</NavLink>
              </li>
            </ul>
          </div>
          <ParcelpilotLogo></ParcelpilotLogo>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu space-x-5 menu-horizontal px-1">
            <li>
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <NavLink to={"/add-parcel"}>Add Parcel</NavLink>
              </li>
               <li>
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to={"/track-parcel"}>Track Parcel</NavLink>
              </li>
              <li>
                <NavLink to={"/coverage"}>Coverage</NavLink>
              </li>
          </ul>
        </div>
        <div className="navbar-end w-76 xl:w-1/2">
          <label className="flex cursor-pointer items-center gap-2 mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
              type="checkbox"
              className="toggle"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
          {currentuser ? (
            <div
              className="tooltip  tooltip-bottom cursor-pointer"
              data-tip={currentuser.displayName}
            >
              <img
                src={currentuser.photoURL}
                className="w-8 h-8 mr-1 rounded-4xl"
              ></img>
            </div>
          ) : (
            <div
              className="tooltip  tooltip-bottom cursor-pointer"
              data-tip="Guest"
            >
              <img
                src="https://i.postimg.cc/xCXgGNKq/image.png"
                className=" w-8 h-8 mr-1"
              ></img>
            </div>
          )}

          {currentuser ? (
            <button
              className="xl:ml-4 ml-1 btn btn-info"
              onClick={hanglegotologin}
            >
              SignOut
            </button>
          ) : (
            <div className="flex">
              <Link to="/authentication">
                {" "}
                <button className="btn  bg-[#0096db] xl:mx-2">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
