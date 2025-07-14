import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../Contexts/AuthContext";
import Loader from "../../../Loader/Loader";


const Manage = () => {
  const {user}=useContext(AuthContext)
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch watchlist items
  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ["watchlist", user?.email],
    queryFn: async () => {
      const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/watchlist?userEmail=${user?.email}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return res.data;
    },
  });
  // console.log(watchlist);

  // Mutation to delete a watchlist item
  const removeItemMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`https://server-side-nine-ruddy.vercel.app/watchlist/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Removed from watchlist!");
      queryClient.invalidateQueries(["watchlist"]);
    },
    onError: () => {
      toast.error("Failed to remove item!");
    },
  });

  const openModal = (id) => {
    setSelectedItemId(id);
    setModalIsOpen(true);
  };

  const confirmRemove = () => {
    removeItemMutation.mutate(selectedItemId);
    setModalIsOpen(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItemId(null);
  };

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4"> 🛠️Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No items in watchlist.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Product</th>
                <th className="py-2 px-4 border">Market</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="py-2 px-4 border">{item.productName}</td>
                  <td className="py-2 px-4 border">{item.market || "—"}</td>
                  <td className="py-2 px-4 border">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      className="bg-[#007c00] text-white px-3 py-1 rounded hover:bg-blue-500"
                      onClick={() => navigate("/all")}
                    >
                      ➕ Add More
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => openModal(item._id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-40 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-6">This item will be removed from your watchlist.</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={confirmRemove}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Manage;
