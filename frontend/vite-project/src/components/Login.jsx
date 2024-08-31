import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner';
import axios from 'axios';
import {  Loader2 } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

function Login() {
  const [showpassword,setShowPassword]=useState(false);
  const [input, setInput] = useState({
   
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();
  const dispatch=useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true)
      const res = await axios.post('https://instagram-clone-backend-qme5.onrender.com/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res.data);
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
      setInput({
        
        email: "",
        password: ""
      })
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);

    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={signupHandler} className='shadow-lg  flex flex-col gap-5 p-8'>
        <div className=''>
          <h1 className='font-bold text-xl '>Instagram</h1>
          <p className='my-3 text-center '>Login to see photos & videos from your friends.</p>
        </div>
        <div>
          <span className='flex justify-start my-2 font-semibold'>Email</span>
          <Input type="email" className="font-medium p=1" placeholder="email@mail.com" name="email" onChange={changeEventHandler} value={input.email} />
        </div>
        <div>
        <span className='flex justify-start my-1 font-semibold'>Password </span>
         <div className='flex items-center justify-center gap-2'>
          <Input type={showpassword ? "text" : "password"} className="font-medium p=1" placeholder="*****"
            name="password" onChange={changeEventHandler} value={input.password} />
            <span onClick={()=>setShowPassword(!showpassword)} className='border border-gray-300 rounded p-1 text-xl cursor-pointer'>{showpassword ? "🙉": "🙈"}</span>
            </div> </div>
       <Link to="/forgot-password-reset"> <h2 className='font-medium text-blue-500 hover:underline cursor-pointer'>Forgot Password..?</h2></Link>
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />

              Please wait
            </Button>
          ) : (
            <Button type='submit' className="my-3">Login</Button>
          )
        }
        <span className='text-center'>Doesn't have an account?  <Link to="/signup" className='font-medium text-blue-500'>Signup</Link>  </span>
       
      </form>
    </div>
  )
}

export default Login  