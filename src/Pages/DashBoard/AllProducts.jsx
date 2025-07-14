import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import Loader from '../../Loader/Loader';

const AllProducts = () => {
  const [rejectingProduct, setRejectingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  // console.log(token)

 
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const res = await axios.get('https://server-side-nine-ruddy.vercel.app/admin/products', {
  headers: {
    authorization: `Bearer ${token}`
  }
});
      return res.data;
    }
  });

  console.log(products)

  

// Approve mutation
const approveMutation = useMutation({
  mutationFn: async (productId) => {
    return await axios.patch(
      `https://server-side-nine-ruddy.vercel.app/products/approve/${productId}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type":'application/json',
        }
      }
    );
  },
  onSuccess: () => {
    toast.success('Product approved!');
    queryClient.invalidateQueries(['all-products']);
  }
});

// Reject mutation
const rejectMutation = useMutation({
  mutationFn: async ({ productId, reason }) => {
    return await axios.patch(
      `https://server-side-nine-ruddy.vercel.app/products/reject/${productId}`,
      reason,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type":"application/json",
        }
      }
    );
  },
  onSuccess: () => {
    toast.error('Product rejected');
    queryClient.invalidateQueries(['all-products']);
    setRejectingProduct(null);
  }
});

// Delete mutation
const deleteMutation = useMutation({
  mutationFn: async (productId) => {
    return await axios.delete(
      `https://server-side-nine-ruddy.vercel.app/products/${productId}`,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    );
  },
  onSuccess: () => {
    toast.success('Product deleted');
    queryClient.invalidateQueries(['all-products']);
    setDeletingProduct(null);
  }
});


  const handleRejectSubmit = (e) => {
    e.preventDefault();
    const reason = e.target.reason.value;
    const feedback = e.target.feedback.value;
    rejectMutation.mutate({
      productId: rejectingProduct._id,
      reason: { reason, feedback }
    });
  };

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Products</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Image</th>
              <th>Product Name</th>
              <th>Date</th>
              <th>Price(per unit)</th>
              <th>Vendor Email</th>
              <th>Market Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, idx) => (
              <tr key={item._id}>
                <td><img src={item.image} alt={item.itemName} className='h-10 w-10' /></td>
                <td>{item.itemName}</td>
                <td>{item.date}</td>
                <td className='text-center'>{item.pricePerUnit}</td>
                <td>{item.vendorEmail}</td>
                <td>{item.marketName}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      item.status === 'approved'
                        ? 'bg-green-500'
                        : item.status === 'rejected'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="space-x-2">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveMutation.mutate(item._id)}
                        className="btn btn-sm bg-green-500 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingProduct(item)}
                        className="btn btn-sm bg-red-500 text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <Link
                    to={`/dashboard-admin/update-product/${item._id}`}
                    className="btn btn-sm  bg-blue-500 text-white"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => setDeletingProduct(item)}
                    className="btn btn-sm bg-gray-700 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <form
            onSubmit={handleRejectSubmit}
            className="bg-white p-6 rounded-md w-[400px] space-y-4"
          >
            <h3 className="text-lg font-bold">Reject Product</h3>
            <div>
              <label className="block font-medium">Reason</label>
              <input
                name="reason"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Feedback</label>
              <textarea
                name="feedback"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingProduct(null)}
                className="btn bg-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="btn bg-red-500 text-white">
                Submit Reject
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-bold mb-2">
              Are you sure you want to delete this product?
            </h3>
            <p className="mb-4">{deletingProduct.title}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="btn bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingProduct._id)}
                className="btn bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
