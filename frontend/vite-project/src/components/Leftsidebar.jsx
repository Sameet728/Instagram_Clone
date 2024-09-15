import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setSuggestedUsers, setUserProfile } from '@/redux/authSlice'
import CreatePost from '@/CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { ImCross } from "react-icons/im";




function Leftsidebar({openMenu ,setOpenMenu}) {
  const navigate=useNavigate();
  const {user}=useSelector(store=>store.auth);
  const dispatch=useDispatch();
  
  const [open,setOpen]=useState(false);
  const logoutHandler=async()=>{
try {
  const res=await axios.post('https://instagram-clone-7akg.onrender.com/api/v1/user/logout',{withCredentials:true});
  if(res.data.success) {
    dispatch(setAuthUser(null));
    dispatch(setPosts(null));
    dispatch(setSelectedPost(null));
   
    dispatch(setUserProfile(null));
    navigate("/login");
    toast.success(res.data.message);}
} catch (error) {
toast.error(error.response.data.message);
};
 };
 const sidebarHandler=(textType)=>{
  console.log(textType);
  if(textType === 'Logout') {
    logoutHandler();
  }else if(textType === 'Create'){
setOpen(true);
setOpenMenu(false);
  } else if (textType === "Profile") {
    navigate(`/profile/${user?._id}`);
}else if (textType === "Home") {
  
  navigate('/');
  setOpenMenu(false);
}
  }

  const sidebarItems=[
    {icon:<Home/>,text:"Home"},
    {icon:<Search />,text:"Search"},
    {icon:<TrendingUp/>,text:"Explore"},
    {icon:<MessageCircle/>,text:"Messages"},
    {icon:<Heart/>,text:"Notifications"},
    {icon:<PlusSquare/>,text:"Create"},
    {icon:<Avatar>
      <AvatarImage src={user?.profilePicture} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    ,text:"Profile"},
    {icon:<LogOut/>,text:"Logout"},
  ];


  return (
    <div className={` fixed top-0 z-10 md:left-0 left-0 px-4 border-r ${openMenu ?"" : "hidden"}  md:block border-gray-300 md:w-[20%] w-[75%] h-screen bg-white z-20  lg:block` }>
      <div className='flex flex-col'>
    <div className='flex items-center justify-center gap-4'> <h1 className='font-bold text-xl my-5'>Instagram</h1> <span className='ml-60 fixed md:hidden xl:hidden' onClick={()=>setOpenMenu(false)}><ImCross /></span></div>
    <hr />
    <div className=' h-[90vh] flex flex-col gap-5 my-3'>
      
{
  sidebarItems.map((item,index)=>{
    return (
      <div onClick={()=> sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3]'>
        <div className='text-xl'>
{item.icon}
        </div>
        <div className='text-xl'>
{item.text}
        </div>

      </div>
    )
  })
}</div>  
    </div>
  <CreatePost open={open} setOpen={setOpen}/>
    </div>
  )
}

export default Leftsidebar