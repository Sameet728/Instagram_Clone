import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Button } from './ui/button'
import { useSendOTP } from '@/hooks/useSendOTP'

function InputOTPP({open,setOpen,otp,setVerifyOtp}) {  
  const [value, setValue] = useState("")
  
  const verificationHandler=()=>{
    console.log(`otp----${otp}`);
    try {
      if(value == otp){
        console.log("correct");
        setVerifyOtp(true);
        setOpen(false);
      }else{
        console.log("wrong")
      }
    } catch (error) {
      console.log(error);
      
    }

  }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={()=>setOpen(false)}>
          <DialogHeader>
           <h2 className='text-center font-semibold '> Verify Your Gmail</h2>
          </DialogHeader>
          <div className="space-y-2">
<InputOTP
maxLength={6}
value={value}
onChange={(value) => {setValue(value)
  console.log(value);
}}

>
<InputOTPGroup className="pl-28">
<InputOTPSlot index={0} />
<InputOTPSlot index={1} />
<InputOTPSlot index={2} />
<InputOTPSlot index={3} />
<InputOTPSlot index={4} />
<InputOTPSlot index={5} />
</InputOTPGroup>
</InputOTP>
<div className="text-center text-sm">
{value === "" ? (
<>Enter your one-time password.</>
) : (
<>You entered: {value}</>
)}
</div>
<div className='flex items-center justify-center'><Button className="my-5" onClick={verificationHandler}>Verify OTP</Button></div>

</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InputOTPP