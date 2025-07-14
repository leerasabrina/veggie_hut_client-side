import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { useEffect } from "react";


const HighlightAdvertisement = () => {
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ["highlight-ads"],
    queryFn: async () => {
      const res = await axios.get("https://server-side-nine-ruddy.vercel.app/advertisements"); 
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Failed to load advertisements</p>;

 useEffect(() => {
  if (!isLoading && ads.length === 0) {
    toast.info("No advertisement is available");
  }
}, [ads, isLoading]);

  return (
    <div className="max-w-6xl mx-auto px-4 my-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Today's Hot Deals </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad._id}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-4 h-[300px] flex flex-col justify-between">
              <img
                src={ad.image}
                alt={ad.title || "Advertisement"}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-bold">{ad.title}</h3>
              <p className="text-sm text-gray-600">{ad.description}</p>
              <p className="mt-2 font-medium text-indigo-600">{ad.vendorName}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HighlightAdvertisement;
