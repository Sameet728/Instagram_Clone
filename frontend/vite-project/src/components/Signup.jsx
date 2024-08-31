import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import InputOTP from './InputOTPP';
import { useSendOTP } from '@/hooks/useSendOTP';


function Signup() {
  const [showpassword,setShowPassword]=useState(false);
  const [verifyotp,setVerifyOtp]=useState(0);
  const [open,setOpen]=useState(false);
  const [otp,setOtp]=useState("");
  const [input,setInput]=useState({
    username:"",
    email:"",
    password:""
  });
  const [loading,setLoading]=useState(false);
  const [otploading,setOtpLoading]=useState(false);
  const navigate= useNavigate();
  const changeEventHandler=(e)=>{
    setInput({...input,[e.target.name]:e.target.value});
  }
  const signupHandler=async(e)=>{
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true)
      const res= await axios.post('http://localhost:3000/api/v1/user/register',input,{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      console.log(res.data);
      navigate("/login");
      if(res.data.success){
        toast.success(res.data.message);
      }
      setInput({
        username: "",
        email: "",
        password: ""
      })
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      
    }finally{
      setLoading(false);
    }
  }
  const OtpwindowHanlder=async()=>{
    try {
      setOtpLoading(true);
      
      // Make the POST request with Axios
      const res = await axios.post(
        'https://instagram-clone-backend-qme5.onrender.com/api/v1/user/send-otp',
        { email: input.email }, // Send the email in the request body
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log(res.data);
      
      if (res.data.success) {
        toast.success(res.data.message);
        setOtp(res.data.otp);
        setOpen(true);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'An error occurred');
      
    } finally {
      setOtpLoading(false);
    }
    
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={signupHandler} className='shadow-lg  flex flex-col gap-5 p-8'>
        <div className=''>
          <h1 className='font-bold text-xl '>Instagram</h1>
          <p className='my-3 text-center '>Signup to see photos & videos from your friends.</p>
        </div>
        <div>
          <span className='flex justify-start my-2 font-semibold'>Username</span>
          <Input type="text" className="font-medium p=1" placeholder="sameet18"
          name="username" onChange={changeEventHandler} value={input.username}/>
        </div>
        <div>
          <span className='flex justify-start my-2 font-semibold'>Email</span>
          <div className='flex gap-2 '>
          <Input type="email" className="font-medium p=1"   disabled={verifyotp} placeholder="email@mail.com" name="email" onChange={changeEventHandler} value={input.email} />
          <Button type="button" className="cursor-pointer" disabled={verifyotp} onClick={OtpwindowHanlder}>{otploading ? "Please Wait": "Send OTP"}</Button>
          <InputOTP open={open} setOpen={setOpen} input={input} otp={otp} setVerifyOtp={setVerifyOtp}/>
          </div>
        </div>
        <div>
        <span className='flex justify-start my-2 font-semibold'>Password </span>
         <div className='flex items-center justify-center gap-2'>
          <Input type={showpassword ? "text" : "password"} className="font-medium p=1" placeholder="*****"
            name="password" onChange={changeEventHandler} value={input.password} />
            <span onClick={()=>setShowPassword(!showpassword)} className='border border-gray-300 rounded p-1 text-xl cursor-pointer'>{showpassword ? "🙉": "🙈"}</span>
            </div> </div>
        {
  verifyotp ? (
    loading ? (
      <Button>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button type="submit" className="my-5">
        Signup
      </Button>
    )
  ) : (
    ""
  )
}

      
                 <span className='text-center'>Already have an account? <Link to="/login" className='font-medium text-blue-500'>Login</Link> </span>
      </form>
    </div>
  )
}

export default Signup   