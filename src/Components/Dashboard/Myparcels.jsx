import React, { useContext, useState } from "react";
import { ValueContext } from "../../Context/ValueContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const Myparcels = () => {
  const queryClient = useQueryClient();
  const { currentuser } = useContext(ValueContext);
  const navigate = useNavigate();
  const axiosInstance = useAxiosSecure();

  const [selectedParcel, setSelectedParcel] = useState(null);

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["my-parcels", currentuser?.email],
    enabled: !!currentuser?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/parcels?email=${currentuser.email}`);
      return res.data;
    },
  });

  if (isLoading || !currentuser) {
    return <div className="text-center mt-10">Loading parcels...</div>;
  }

  const onDelete = (id) => {
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
        axiosInstance
          .delete(`/parcels/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Parcel has been deleted.", "success");
            queryClient.invalidateQueries(["my-parcels", currentuser.email]);
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  };

  const onPay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  return (
    <div className="overflow-x-auto p-4">
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

              <td className="px-1.5 py-2 text-center">
                <button
                  className={`px-3 py-1 rounded font-semibold text-white ${
                    parcel.payment_status === "paid" ? "bg-green-500" : "bg-red-500"
                  }`}
                  disabled
                >
                  {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
                </button>
              </td>

              <td className="px-1.5 py-2 text-center">{parcel.cost}</td>
              <td className="px-1.5 py-2 text-center">{parcel.weight}</td>

              <td className="px-1.5 py-2 space-x-1 text-center">
                {parcel.payment_status !== "paid" && (
                  <button
                    onClick={() => onPay(parcel._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Pay
                  </button>
                )}
                <button
                  onClick={() => setSelectedParcel(parcel)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(parcel._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedParcel && (
        <dialog id="parcel_details_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg">
            <h3 className="font-bold text-lg mb-4">Parcel Details</h3>
            <div className="text-sm space-y-2">
              <p><strong>Title:</strong> {selectedParcel.title}</p>
              <p><strong>Tracking ID:</strong> {selectedParcel.tracking_id}</p>
              <p><strong>Type:</strong> {selectedParcel.type}</p>
              <p><strong>Cost:</strong> {selectedParcel.cost} ৳</p>
              <p><strong>Weight:</strong> {selectedParcel.weight} kg</p>
              <p><strong>Status:</strong> {selectedParcel.delivery_status}</p>
              <p><strong>Sender Name:</strong> {selectedParcel.senderName}</p>
              <p><strong>Sender Address:</strong> {selectedParcel.senderAddress}</p>
              <p><strong>Receiver Name:</strong> {selectedParcel.receiverName}</p>
              <p><strong>Receiver Address:</strong> {selectedParcel.receiverAddress}</p>
              <p><strong>Service Center:</strong> {selectedParcel.senderServiceCenter}</p>
              <p><strong>Pickup Instruction:</strong> {selectedParcel.pickupInstruction || "None"}</p>
              <p><strong>Payment Status:</strong> {selectedParcel.payment_status}</p>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedParcel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Myparcels;
