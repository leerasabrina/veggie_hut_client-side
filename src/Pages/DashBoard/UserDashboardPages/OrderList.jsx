import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Contexts/AuthContext";
import Loader from "../../../Loader/Loader";

const OrderList = () => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem('token')
  console.log(user.email)
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myOrders", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axios.get(
        `https://server-side-nine-ruddy.vercel.app/orders?email=${user?.email}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
      );
      return res.data;
    },
  });
  console.log(orders)

  if (isLoading || loading) return <Loader />;
  if (isError) return toast.error('Failed to load data');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border text-[#007c00]">Product Name</th>
                <th className="py-2 px-4 border text-[#007c00]">Market Name</th>
                <th className="py-2 px-4 border text-[#007c00]">Price (USD)</th>
                <th className="py-2 px-4 border text-[#007c00]">Date</th>
                <th className="py-2 px-4 border text-[#007c00]">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="py-2 px-4 border">{order.productName}</td>
                  <td className="py-2 px-4 border">{order.market}</td>
                  <td className="py-2 px-4 border">${order.price}</td>
                  <td className="py-2 px-4 border">{order.date}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => navigate(`/market/${order.productId}`)}
                      className="bg-[#007c00] hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                       View Details
                    </button>
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

export default OrderList;
