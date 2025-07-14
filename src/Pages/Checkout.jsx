import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const Checkout = ({ product, email, onSuccess }) => {
  console.log(product, email);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const token = localStorage.getItem('token');

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#e53e3e",
      },
    },
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.post("https://server-side-nine-ruddy.vercel.app/create-payment-intent", {
        pricePerUnit: product.pricePerUnit,
        email: email,
        productId: product._id
      },{
        headers:{
          Authorization:`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      });

      const clientSecret = res.data.clientSecret;
      if (!clientSecret) {
        toast.error("Client secret pawa jai ni.");
        setLoading(false);
        return;
      }
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email: email,
          },
        },
      });

      if (result.error) {

        console.error("Stripe error:", result.error.message);
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {

        await axios.post("https://server-side-nine-ruddy.vercel.app/payment-success", {
          transactionId: result.paymentIntent.id,
          name,
          email: email,
          market: product.marketName,
          productId: product._id,
          productName: product.itemName,
          price: product.pricePerUnit,
          date: new Date().toISOString().slice(0, 10),
        },{
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
          }
      });

        toast.success("Payment successful!");
        onSuccess();
      } else {
        console.warn("Payment status unexpected:", result.paymentIntent.status);
      }
    } catch (error) {
      console.error("Payment error:", error.message);
      toast.error("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <label className="block">
        Name on Card:
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block">
        Card Info:
        <div className="p-3 mt-1 border rounded">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </label>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : `Pay ৳${product.pricePerUnit}`}
      </button>
    </form>
  );
};

export default Checkout;
