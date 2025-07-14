import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import Swal from "sweetalert2";
import { useState } from "react";

const AllAdvertisement = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const [selectedAd, setSelectedAd] = useState(null);
  const [feedback, setFeedback] = useState("");

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["all-ads"],
    queryFn: async () => {
      const res = await axios.get("https://server-side-nine-ruddy.vercel.app/admin/advertisements", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, feedback }) => {
      return await axios.patch(
        `https://server-side-nine-ruddy.vercel.app/admin/advertisements/${id}`,
        { status, feedback },
        {
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type':'application/json',
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries(["all-ads"]);
      setSelectedAd(null);
      setFeedback("");
    },
  });

  const deleteAd = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`https://server-side-nine-ruddy.vercel.app/admin/advertisements/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,         
        },
      });
    },
    onSuccess: () => {
      toast.success("Ad deleted");
      queryClient.invalidateQueries(["all-ads"]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This ad will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAd.mutate(id);
      }
    });
  };

  const handleRejectSubmit = () => {
    if (selectedAd && feedback) {
      updateStatus.mutate({ id: selectedAd._id, status: "rejected", feedback });
    } else {
      toast.error("Feedback is required.");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Advertisements</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.email}</td>
                <td className="capitalize">{ad.status}</td>
                <td className="space-x-2">
                 <button
  onClick={() => updateStatus.mutate({ id: ad._id, status: "approved" })}
  className="btn btn-xs btn-success"
  disabled={ad.status === "approved"}
>
  Approve
</button>

                   <button
    onClick={() => setSelectedAd(ad)}
    className="btn btn-xs btn-warning"
    disabled={ad.status === "rejected"}
  >
    Reject
  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="btn btn-xs btn-error"
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
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4">Reject Advertisement</h3>
            <p className="mb-2">Ad: {selectedAd.title}</p>
            <textarea
              rows="3"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter rejection reason..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm"
                onClick={() => {
                  setSelectedAd(null);
                  setFeedback("");
                }}
              >
                Cancel
              </button>
              <button className="btn btn-sm btn-warning" onClick={handleRejectSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdvertisement;
