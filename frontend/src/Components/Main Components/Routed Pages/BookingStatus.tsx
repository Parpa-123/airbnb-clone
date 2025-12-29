import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

const BookingStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axiosInstance.get(`/bookings/${id}/`);
      setStatus(res.data.status);

      if (res.data.status === "confirmed") {
        clearInterval(interval);
        navigate(`/bookings/${id}/confirmed`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Processing payment...</h1>
      <p className="text-gray-500 mt-2">
        Please don’t refresh or close this page.
      </p>
    </div>
  );
};

export default BookingStatus;
