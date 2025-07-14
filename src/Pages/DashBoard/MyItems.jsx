import { useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../Contexts/AuthContext";
import Loader from "../../Loader/Loader";
import Swal from "sweetalert2";

const MyItems = () => {
  const { user, loading } = useContext(AuthContext);
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem('token');

  // Get products
  const { data: myProducts = [], isLoading, refetch } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["my-products", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `https://server-side-nine-ruddy.vercel.app/my-products?email=${user.email}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      return res.data;
    },
  });
  console.log(myProducts)

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`https://server-side-nine-ruddy.vercel.app/vendor/products/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (loading || isLoading) return <Loader></Loader>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Products</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>No.</th>
              <th>Item Name</th>
              <th>Price/Unit</th>
              <th>Market</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {myProducts.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>{item.itemName}</td>
                <td>{item.pricePerUnit}৳</td>
                <td>{item.marketName}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`font-semibold ${
                      item.status === "pending"
                        ? "text-orange-500"
                        : item.status === "approved"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.status === "rejected" && item.rejectionFeedback && (
                    <p className="text-xs text-gray-500 italic">
                      ({item.rejectionFeedback
})
                    </p>
                  )}
                </td>
                <td>
                  <Link
                    to={`/dashboard-seller/update-product/${item._id}`}
                    className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Update
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                    disabled={deletingId === item._id && deleteMutation.isPending}
                  >
                    {deletingId === item._id && deleteMutation.isPending
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyItems;
