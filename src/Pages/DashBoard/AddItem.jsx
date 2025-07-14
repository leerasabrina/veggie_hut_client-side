import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Contexts/AuthContext';

const AddItem = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { register, handleSubmit, reset } = useForm();
  const token = localStorage.getItem('token');

  const { mutate: addProduct, isLoading } = useMutation({
    mutationFn: async (productData) => {
      const res = await axios.post('https://server-side-nine-ruddy.vercel.app/products', productData,{
        headers:{
          authorization:`Bearer ${token}`,
          'Content-Type':'application/json',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Product Added Successfully!');
      reset();
    },
    onError: () => {
      toast.error('Failed to add product');
    },
  });

  const onSubmit = (data) => {
    const product = {
      vendorEmail: user?.email,
      vendorName: user?.displayName || 'Anonymous Vendor',
      marketName: data.marketName,
      date: selectedDate.toISOString().split('T')[0],
      marketDescription: data.marketDescription,
      itemName: data.itemName,
      status: 'pending',
      image: data.image,
      pricePerUnit: parseFloat(data.pricePerUnit),
      prices: [
        {
          date: selectedDate.toISOString().split('T')[0],
          price: parseFloat(data.pricePerUnit),
        },
      ],
      itemDescription: data.itemDescription || '',
    };
    addProduct(product);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🧾 Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input value={user?.email} readOnly className="input input-bordered w-full" />
        <input value={user?.displayName} readOnly className="input input-bordered w-full" />

        <input
          {...register('marketName', { required: true })}
          placeholder="🏪 Market Name"
          className="input input-bordered w-full"
        />

        <div>
          <label className="block mb-1">📅 Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="input input-bordered w-full"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <textarea
          {...register('marketDescription', { required: true })}
          placeholder="📝 Market Description"
          className="textarea textarea-bordered w-full"
        ></textarea>

        <input
          {...register('itemName', { required: true })}
          placeholder="🥦 Item Name"
          className="input input-bordered w-full"
        />

        <input
          {...register('image', { required: true })}
          placeholder="🖼️ Product Image URL"
          className="input input-bordered w-full"
        />

        <input
          {...register('pricePerUnit', { required: true })}
          placeholder="💵 Price per Unit (e.g. 30)"
          type="number"
          step="0.01"
          className="input input-bordered w-full"
        />

        <textarea
          {...register('itemDescription')}
          placeholder="📝 Item Description (optional)"
          className="textarea textarea-bordered w-full"
        ></textarea>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
