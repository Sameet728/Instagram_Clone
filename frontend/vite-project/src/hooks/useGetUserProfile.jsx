
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`https://instagram-clone-7akg.onrender.com/api/v1/user/${userId}/profile`, { withCredentials: true });
                console.log(res.data);  
                if (res.data.success) { 
                //   console.log(`res data == ${res.data}`)
                dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }   
        }
        fetchSuggestedUsers();
    }, [userId]);
};
export default useGetUserProfile;