import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";
import Loader from "../Loader/Loader";

const Chart = ({ product }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const token = localStorage.getItem('token');

  const { data = [], isLoading } = useQuery({
    queryKey: ["publicProducts", product], 
    queryFn: async () => {
      const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/public/product-prices/${product}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return res.data;
    },
  });

  console.log("Data:", data);

  if (isLoading) return <Loader />;

  const allDates = [...new Set(data.map((d) => d.date))];
  console.log("All Dates:", allDates);

  const latestDate = allDates[0]; 
  const currentData = data.find((d) => d.date === latestDate);
  const previousData = data.find((d) => d.date === selectedDate);

  const combinedChartData =
    currentData?.products.map((item) => {
      const previousItem = previousData?.products.find((p) => p.name === item.name);
      const prevPrice = previousItem ? previousItem.price : 0;
      return {
        itemName: item.name,
        currentPrice: item.price,
        previousPrice: prevPrice,
        priceDiff: item.price - prevPrice,
      };
    }) || [];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">📊 Comparison with Previous Data</h2>

      <label className="block mb-4">
        Select a previous date:
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border ml-2 px-2 py-1"
        >
          <option value="">-- Select Date --</option>
          
          {allDates.length > 1
            ? allDates.slice(1).map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))
            : allDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
        </select>
      </label>

      {selectedDate && combinedChartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={combinedChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="itemName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="previousPrice" fill="#8884d8" name="Previous Price" />
            <Bar dataKey="currentPrice" fill="#82ca9d" name="Current Price" />
            <Bar dataKey="priceDiff" fill="#ff7300" name="Price Change" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
