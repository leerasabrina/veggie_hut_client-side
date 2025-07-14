import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../Contexts/AuthContext';
import Loader from '../../Loader/Loader';


const MyAdvertisement= () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState(null);
const token = localStorage.getItem('token');
  // Fetch ads
  const { data: myAds = [], isLoading } = useQuery({
    queryKey: ['my-ads', user?.email],
    queryFn: async () => {
      const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/my-advertisements?email=${user.email}`,{
      headers:{
        authorization:`Bearer ${token}`,
      },
    });
      console.log(res.data);
      return res.data;
    },
    enabled: !!user?.email,
  });




const updateMutation = useMutation({
  mutationFn: async (updatedAd) => {
    const { _id, ...updateData } = updatedAd;
    const res = await axios.patch(`https://server-side-nine-ruddy.vercel.app/advertisements/${_id}`, updateData,{
      headers:{
        authorization:`Bearer ${token}`,
        "Content-Type":'application/json',
      },
    });
    return res.data;
  },
  onSuccess: () => {
    toast.success('Advertisement updated!');
    queryClient.invalidateQueries(['my-ads']);
    setEditingAd(null);
  },
  onError: (err) => {
    console.error("Update failed:", err);
    toast.error('Failed to update ad');
  },
});


  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`https://server-side-nine-ruddy.vercel.app/advertisements/${id}`,{
      headers:{
        authorization:`Bearer ${token}`,
      },
    });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Ad deleted successfully');
      queryClient.invalidateQueries(['my-ads']);
    },
    onError: () => toast.error('Failed to delete ad'),
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedAd = {
      _id: editingAd._id,
      title: form.title.value,
      description: form.description.value,
      image: form.image.value,
    };
    updateMutation.mutate(updatedAd);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Advertisements</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myAds.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>{ad.status}</td>
                <td>
                  <button
                    onClick={() => setEditingAd(ad)}
                    className="btn btn-xs bg-blue-500 text-white mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="btn btn-xs bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4"
          >
            <h3 className="text-xl font-bold">Update Advertisement</h3>
            <input
              name="title"
              defaultValue={editingAd.title}
              placeholder="Title"
              className="input input-bordered w-full"
              required
            />
            <textarea
              name="description"
              defaultValue={editingAd.description}
              placeholder="Short Description"
              className="textarea textarea-bordered w-full"
              required
            />
            <input
              name="image"
              defaultValue={editingAd.image}
              placeholder="Image URL"
              className="input input-bordered w-full"
              required
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingAd(null)} className="btn">
                Cancel
              </button>
              <button type="submit" className="btn bg-blue-500 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyAdvertisement;
