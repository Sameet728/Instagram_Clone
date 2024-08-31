import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get('https://instagram-clone-backend-qme5.onrender.com/api/v1/user/suggested', { withCredentials: true });

        if (res.data.success) {
          if (res.data.users.length > 0) {
            dispatch(setSuggestedUsers(res.data.users));
          } else {
            console.log("No suggested users found.");
            dispatch(setSuggestedUsers([])); // You might still want to dispatch an empty array
          }
        }
      } catch (error) {
        console.log("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetSuggestedUsers;
