import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import Loader from "../../../Loader/Loader"; 

const View = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = localStorage.getItem('token');

  
  const {
    data: products = [],
    isLoading: loadingProducts
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("https://server-side-nine-ruddy.vercel.app/products",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return res.data;
    },
  });

  //  Fetch price trend data
  const {
    data: trendData = [],
    isLoading: loadingTrend
  } = useQuery({
    queryKey: ["trend", selectedProduct],
    enabled: !!selectedProduct,
queryFn: async () => {
  const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/public/product-prices/${selectedProduct}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
  const rawData = res.data;
  console.log(rawData)

  const groupedByDate = {};

  rawData.forEach(entry => {
    const dateKey = new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    //  Filter the product that matches the selectedProduct
    const product = entry.products.find(p => p.name === selectedProduct);
    if (product && product.price) {
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(product.price);
    }
  });

  const trendPoints = Object.entries(groupedByDate).map(([date, prices]) => {
    const avg = prices.reduce((sum, val) => sum + val, 0) / prices.length;
    return {
      date,
      price: parseFloat(avg.toFixed(2)),
    };
  });

  return trendPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
}



  });

  
  const getTrendPercentage = () => {
    if (trendData.length < 2) return 0;
    const first = trendData[trendData.length - 1]?.price;
    const last = trendData[0]?.price;
    if (!first || !last) return 0;
    const change = ((last - first) / first) * 100;
    return change.toFixed(1);
  };

  const uniqueItems = [...new Set(products.map(p => p.itemName))];
  const selectedItemInfo = products.find(p => p.itemName === selectedProduct);

  if (loadingProducts) return <Loader />;

  return (
    <div className="flex h-screen p-4 ">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-xl overflow-y-auto">
        <p className="text-lg font-bold mb-3">📊 Tracked Items</p>
        <ul className="space-y-2">
          {uniqueItems.map((item, idx) => (
            <li
              key={idx}
              className={`cursor-pointer px-3 py-2 rounded hover:bg-green-200 ${
                selectedProduct === item ? "bg-[#007c00] text-white  font-semibold" : ""
              }`}
              onClick={() => setSelectedProduct(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Chart Area */}
      <div className="w-3/4 bg-white p-6 rounded-lg shadow">
        {selectedProduct ? (
          loadingTrend ? (
            <Loader />
          ) : (
            <>
           <div className="flex"><img className="h-10 w-10 rounded-full" src={selectedItemInfo?.image} alt={selectedItemInfo?.itemName} /><h2 className="font-bold text-[#007c00] lg:ml-4 text-2xl">{selectedItemInfo?.itemName || "Selected Item"}</h2></div>
              <h2 className="text-lg font-semibold mb-2 mt-4">
                {selectedItemInfo?.marketName || "Selected Market"}
              </h2>
              <p className="text-gray-600 mb-2">
                Vendor: {selectedItemInfo?.vendorName || "Unknown"}
              </p>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`Price – ${value}`, ""]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line type="monotone" dataKey="price" stroke="#007C00" dot />
                </LineChart>
              </ResponsiveContainer>

              <p className={`mt-3 text-lg font-medium ${getTrendPercentage() >= 0 ? "text-green-600" : "text-red-500"}`}>
                Trend: {getTrendPercentage() >= 0 ? "+" : ""}
                {getTrendPercentage()}% last {trendData.length} days
              </p>
            </>
          )
        ) : (
          <p className="text-green-700 text-lg">Select a product to view price trend</p>
        )}
      </div>
    </div>
  );
};

export default View;
