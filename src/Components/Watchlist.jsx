import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Contexts/AuthContext";

const Watchlist = ({ product }) => {
  const { user } = useContext(AuthContext); 
  const [isAdded, setIsAdded] = useState(false);
  const role = user.role;
  const token = localStorage.getItem('token');
  console.log({product})

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    const watchItem = {
      productId: product._id,
      productName: product.itemName,
      pricePerUnit: product.pricePerUnit,
      market:product.marketName,
      userEmail: user.email,
      date: new Date().toISOString()
    };

    try {
     
      // console.log('watch',watchItem)
      const res = await axios.post("https://server-side-nine-ruddy.vercel.app/watchlist", watchItem,{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        }
      });
    
      if (res.data.insertedId) {
        toast.success("Successfully added");
        setIsAdded(true);
      } else {
        toast.warn("Already added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cannot add this");
    } 
  };

 
  const isDisabled = role === "admin" || role === "vendor";

  return (
    <div className="my-4">
      <button
        onClick={handleAddToWatchlist}
        disabled={isDisabled}
        className={`px-4 py-2 rounded ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
       {isAdded?'Added to Watchlist':"⭐ Add to watchlist"}
      </button>
    </div>
  );
};

export default Watchlist;
