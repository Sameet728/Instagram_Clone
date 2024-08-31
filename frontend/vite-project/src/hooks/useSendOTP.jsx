// useSendOTP.js (React Hook)
import { useState } from 'react';

export const useSendOTP = (email) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendOTP = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('https://instagram-clone-backend-qme5.onrender.com/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email}),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        console.log('OTP:', data.otp); // Log OTP to console (for testing)
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendOTP, loading, error, success };
};
