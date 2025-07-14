import { useState, useEffect, useContext } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Contexts/AuthContext";

const ReviewStar = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const token = localStorage.getItem("token");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // Check if user already reviewed
  const hasReviewed = reviews.some((rev) => rev.email === user?.email);

  // Fetch all reviews for this product
  useEffect(() => {
    axios
      .get(`https://server-side-nine-ruddy.vercel.app/reviews/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please login to submit a review");
    }

    const reviewData = {
      name: user.displayName,
      email: user.email,
      productId,
      rating,
      comment,
      date: new Date(),
    };

    try {
      const res = await axios.post(
        "https://server-side-nine-ruddy.vercel.app/reviews",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.insertedId) {
        toast.success("Review submitted!");
        setComment("");
        setRating(0);
        setHoverRating(0);
        setReviews([reviewData, ...reviews]);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You have already reviewed this product.");
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  return (
    <div className="max-w-2xl mt-6">
      <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>

      {hasReviewed ? (
        <p className="text-gray-500 mb-4">You have already submitted a review for this product.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                className={`cursor-pointer ${(hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Was the price fair? Any changes recently?"
            className="w-full border rounded-md p-2 mb-2"
            rows="3"
            required
          />

          <button
            type="submit"
            disabled={user?.role === "vendor"}
            className={`px-4 py-2 rounded transition ${
              user?.role === "vendor"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#007c00] text-white hover:bg-green-700"
            }`}
          >
            Submit Review
          </button>
        </form>
      )}

      <h3 className="text-lg font-semibold mb-3">All Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((rev, idx) => (
          <div key={idx} className="border rounded p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar
                  key={s}
                  size={16}
                  className={`${rev.rating >= s ? "text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="mb-1">{rev.comment}</p>
            <p className="text-sm text-gray-600">
              {rev.name} ({rev.email}) — {new Date(rev.date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewStar;
