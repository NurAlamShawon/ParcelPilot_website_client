import React from "react";
import useAxiosSecure from "../Hooks/UseaxiosSecure";


const useApplicationAPI = () => {
  const axiosSecure = useAxiosSecure();
  const myBorrowPromise = async (email) => {
    try {
      const res = await axiosSecure.get(`/borrow?email=${email}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching borrow data:", error);
      return []; // Return an empty array or handle appropriately
    }
  };
  return { myBorrowPromise };
};

export default useApplicationAPI;