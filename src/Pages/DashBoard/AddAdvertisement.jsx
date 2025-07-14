import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";


const AddAdvertisement = () => {
  const { register, handleSubmit, reset } = useForm();
  const {user} = useContext(AuthContext);
  const token = localStorage.getItem('token')

  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newAd) => {
      const res = await axios.post("https://server-side-nine-ruddy.vercel.app/advertisements", newAd,{
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Advertisement submitted (pending review)");
      reset();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = async (data) => {
    const adData = {
      title: data.title,
      description: data.description,
      image: data.image,
      status: "pending", 
      email: user.email,
    };
    await mutateAsync(adData);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Add New Advertisement</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("title", { required: true })}
          placeholder="Ad Title"
          className="input input-bordered w-full"
        />

        <textarea
          {...register("description", { required: true })}
          placeholder="Short Description"
          className="textarea textarea-bordered w-full"
        ></textarea>

        <input
          type="text"
          {...register("image", { required: true })}
          placeholder="Image URL (hosted)"
          className="input input-bordered w-full"
        />

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-full"
        >
          {isPending ? "Submitting..." : "Submit Advertisement"}
        </button>
      </form>
    </div>
  );
};

export default AddAdvertisement;
