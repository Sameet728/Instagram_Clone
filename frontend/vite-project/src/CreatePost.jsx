
import React, { useState } from 'react'
import { DialogContent, Dialog, DialogHeader } from './components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { readFileAsDataURL } from './lib/utils';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from './redux/postSlice';


function CreatePost({ open, setOpen }) {
  const { user } = useSelector(store => store.auth);
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {posts}=useSelector(store=>store.post);
  const dispatch=useDispatch();


  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }
  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post('https://instagram-clone-7akg.onrender.com/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post,...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption("");
        setFile("");
        setImagePreview("");
      }
    } catch (error) {
      toast.error(error.response.data.message);

    } finally {
      setLoading(false);
    }
  }
  return (
    <div>

      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className="font-semibold text-center text-xl">Create a Post</DialogHeader>
          <div className='flex flex-col gap-3 '>
            <div className='flex items-center gap-3'><Avatar>
              <AvatarImage src={user?.profilePicture || ""} alt="img"></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
              <h1 className='font-semibold text-sm '>{user?.username}</h1>
            </div>
            <div className='flex gap-2 flex-col '>
              <Textarea className="" placeholder='Write a Caption here...' value={caption} onChange={(e) => { setCaption(e.target.value) }} name="caption"></Textarea>
              {
                imagePreview && (
                  <div className=''>
                    <img src={imagePreview} alt="" className='h-full w-full rounded-lg object-cover' />
                  </div>
                )
              }

            </div>
            <Input type="file" className="bg-teal-400 text-white" onChange={fileChangeHandler}></Input>
            {
              imagePreview && (
                loading ?
                  <Button><Loader2 className='animate-spin mr-2 h-4 w-4' /> Please Wait</Button>
                  :
                  <Button onClick={createPostHandler} type="submit">Post</Button>
              )
            }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatePost