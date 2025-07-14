import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../Contexts/AuthContext";

const UpdateItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const token = localStorage.getItem('token');
  console.log(role);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/products/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`,         
        }
      });
        console.log(res.data)
        reset(res.data);
      } catch (err) {
        toast.error("Failed to load product data");
      }
    };
    fetchProduct();
  }, [id, reset]);

  const goToDashboard = () => {
    if (role === 'admin') {
      navigate('/dashboard-admin/all-product');
    } else if (role === 'vendor') {
      navigate('/dashboard-seller/my-items');
    } else {
      navigate('/');
    }
  };

  const onSubmit = async (data) => {
    try {
      data.pricePerUnit = parseFloat(data.pricePerUnit);

      const res = await axios.patch(`https://server-side-nine-ruddy.vercel.app/products/${id}`, data,{
        headers:{
          Authorization:`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      });
      if (res.data.modifiedCount > 0) {
        toast.success("Product updated successfully");
        goToDashboard();
      } else {
        toast.info("No changes were made");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Update Product</h2>

      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Item Name */}
        <div>
          <label className="block mb-1 font-medium">Item Name</label>
          <input
            type="text"
            {...register("itemName", { required: true })}
            className="w-full input input-bordered"
          />
        </div>

        {/* Price per Unit */}
        <div>
          <label className="block mb-1 font-medium">Price per Unit (৳)</label>
          <input
            type="number"
            step="0.01"
            {...register("pricePerUnit", { required: true })}
            className="w-full input input-bordered"
          />
        </div>

        {/* Market Name */}
        <div>
          <label className="block mb-1 font-medium">Market Name</label>
          <input
            type="text"
            {...register("marketName", { required: true })}
            className="w-full input input-bordered"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="w-full input input-bordered"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateItem;
