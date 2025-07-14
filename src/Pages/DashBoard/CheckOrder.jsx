import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import Loader from "../../Loader/Loader";
import { toast } from "react-toastify";


const CheckOrder = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allOrdersForAdmin"],
    queryFn: async () => {
      const res = await axios.get("https://server-side-nine-ruddy.vercel.app/payment-success", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  if (isLoading) return <Loader />;
  if (isError) return toast.error(error.message);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border  text-sm">
            <thead className="text-[#007c00]">
              <tr>
                <th className="border  border-gray-300  px-4 py-2">No.</th>
                <th className="border  border-gray-300  px-4 py-2">Product</th>
                <th className="border  border-gray-300  px-4 py-2">Market</th>
                <th className="border  border-gray-300  px-4 py-2">Price</th>
                <th className="border  border-gray-300  px-4 py-2">Buyer Name</th>
                <th className="border  border-gray-300  px-4 py-2">Buyer Email</th>
                <th className="border  border-gray-300  px-4 py-2">Transaction ID</th>
                <th className="border  border-gray-300  px-4 py-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.productName || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.market || "N/A"}</td>
                  <td className="border border-gray-300  px-4 py-2">৳{order.price}</td>
                  <td className="border border-gray-300  px-4 py-2">{order.name || "N/A"}</td>
                  <td className="border border-gray-300  px-4 py-2">{order.email}</td>
                  <td className="border border-gray-300  px-4 py-2">{order.transactionId}</td>
                  <td className="border border-gray-300  px-4 py-2">
                    {order.date ? new Date(order.date).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckOrder;
