import React from "react";
import UseUserRole from "../../Hooks/UseuserRole";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import Forbidden from "../Forbidden/Forbidden";

const Dashboard = () => {
  const { role } = UseUserRole();

  if (role === "user") {
    return <UserDashboard></UserDashboard>;
  } else if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default Dashboard;
