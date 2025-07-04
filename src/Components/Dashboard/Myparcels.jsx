import React, { useContext } from "react";
import { ValueContext } from "../../Context/ValueContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";





const Myparcels = () => {
    const queryClient=useQueryClient();
  const { currentuser } = useContext(ValueContext);
  const navigate=useNavigate();
  console.log(currentuser);
  const axiosInstance = useAxiosSecure();

 const { data: parcels = [], isLoading } = useQuery({
  queryKey: ["my-parcels", currentuser?.email],
  enabled: !!currentuser?.email, 
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parcels?email=${currentuser.email}`
      );
      return res.data;
    },
});


 if (isLoading) {
    return <div className="text-center mt-10">Loading parcels...</div>;
  }

  if (!currentuser) {
  return <div className="text-center mt-10">Loading parcels...</div>;
}


  const onDelete= id=>{
     Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this parcel?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axiosInstance.delete(`/parcels/${id}`)
        .then((res) => {
          Swal.fire("Deleted!", "Parcel has been deleted.", "success");
          console.log(res)
           queryClient.invalidateQueries(["my-parcels", currentuser.email]);
          // You might want to refetch or update your state here
        })
        .catch((err) => {
          Swal.fire("Error", "Something went wrong!", "error");
          console.log(err)
        });
    }
  });
  }


const onPay=id=>{
navigate(`/dashboard/payment/${id}`);
}



  return (
<div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200 text-sm text-left">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-1.5 py-2 text-center">Title</th>
        <th className="px-1.5 py-2 text-center">Tracking Id</th>
        <th className="px-1.5 py-2 text-center">Type</th>
        <th className="px-1.5 py-2 text-center">Payment</th>
        <th className="px-1.5 py-2 text-center">Cost (৳)</th>
        <th className="px-1.5 py-2 text-center">Weight (kg)</th>
        <th className="px-1.5 py-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {parcels.map((parcel) => (
        <tr key={parcel._id} className="border-b">
          <td className="px-1.5 py-2 font-medium text-center">{parcel.title}</td>
           <td className="px-1.5 py-2 font-medium text-center">{parcel.tracking_id}</td>
          <td className="px-1.5 py-2 capitalize text-center">{parcel.type}</td>

          {/* Payment Status Button */}
          <td className="px-1.5 py-2 text-center">
            <button
              className={`px-3 py-1 rounded font-semibold text-white ${
                parcel.payment_status === "paid"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
              disabled
            >
              {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
            </button>
          </td>

          <td className="px-1.5 py-2 text-center">{parcel.cost}</td>
          <td className="px-1.5 py-2 text-center">{parcel.weight}</td>

          <td className="px-1.5 py-2 space-x-2 text-center">
            {/* Pay Button only if unpaid */}
            {parcel.payment_status !== "paid" && (
              <button
                onClick={() => onPay(parcel._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Pay
              </button>
            )}
            <button
              // onClick={() => onView(parcel)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              View
            </button>
            <button
              onClick={() => onDelete(parcel._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default Myparcels;
