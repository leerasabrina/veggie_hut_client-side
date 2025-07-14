import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import Loader from "../Loader/Loader";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import './component.css';
import { motion } from "framer-motion";


const Product = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ['public-products'],
    queryFn: async () => {
      const res = await axios.get("https://server-side-nine-ruddy.vercel.app/public/products");
      return res.data;
    }
  });


  //  all products
 if (isLoading) return <Loader />;

// Flatten all products
let allProducts = [];
markets.forEach((market) => {
  market.products.forEach((item) => {
    allProducts.push({
      productId: item.productId,
      itemName: item.name,
      price: item.price,
      marketName: market.marketName,
      date: market.date,
      image: market.image,
    });
  });
});

// Sort by latest date first
allProducts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Take only the latest 6 unique combinations of itemName + marketName
const seen = new Set();
const uniqueProducts = [];

for (const product of allProducts) {
  const key = `${product.itemName}_${product.marketName}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueProducts.push(product);
  }

  if (uniqueProducts.length === 6) break;
}


  return (
    <div className="max-w-6xl mx-auto md:px-4 py-10 lg:mt-10">
      <h2 className="text-2xl text-center font-semibold mb-6">Fresh Picks from the Bazar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {uniqueProducts.map((product, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: idx * 0.1 }}
    viewport={{ once: true, amount: 0.2 }}
    className="bg-white shadow-md shadow-gray-200 border border-gray-100 rounded-2xl p-4"
  >
    <img
      src={product.image}
      alt={product.marketName}
      className="w-full h-48 object-cover rounded-xl mb-3"
    />
    <h3 className="text-xl font-semibold">{product.marketName}</h3>
    <p className="text-sm text-gray-600">
      {new Date(product.date).toLocaleDateString()}
    </p>
    <ul className="mt-2 text-sm space-y-1">
      <li>
        {product.itemName} — ৳{product.price}/kg
      </li>
    </ul>
    <button
      onClick={() => {
        if (user) {
          navigate(`/market/${product.productId}`);
        } else {
          navigate("/signin");
        }
      }}
      className="mt-4 bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-lg text-sm"
    >
      View Details
    </button>
  </motion.div>
))}

      </div>
    </div>
  );
};

export default Product;
