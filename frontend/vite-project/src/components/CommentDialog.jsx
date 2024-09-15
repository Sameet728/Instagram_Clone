import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

function CommentDialog({ open, setOpen, post }) {
  const [commentText, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const commentHandler = async () => {
    
    try {
      const res = await axios.post(`https://instagram-clone-7akg.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { commentText }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
        setText("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);

    }
     
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="p-0 max-w-5xl ">
          <div className='flex'>
            <div className='hidden md:block md:w-1/2 flex'>
              <img className="rounded-lg my-2 w-full aspect-square object-cover" src={post?.image} alt="post_image" />
            </div>
            <div className='w-full md:w-1/2 flex flex-col '>
              <div className=' flex items-center p-2'>
                <Avatar>
                  <Link><AvatarImage src={post?.author?.profilePicture} alt="post_image" /></Link>
                  <AvatarFallback>CN </AvatarFallback>
                </Avatar>
                <div className='ml-2 flex items-center '>
                  <Link> <h2 className='font-semibold text-sm '>{post?.author?.username}</h2></Link>
                  <Dialog >
                    <DialogTrigger>
                      <MoreHorizontal className="cursor-pointer absolute right-7 top-4" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text=sm text-center">
                      <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                      <Button variant='ghost' className="cursor-pointer w-fit ">Add to favorites</Button>

                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <hr />
              {/* //Comments */}
              <div className='flex-1 overflow-y-auto max-h-96 p-4'>

                {post?.comments.map((comment)=><Comment key={comment._id} comment={comment}/>)}
              </div>
              {/* input commnest */}
              <div className='m-2'>
                <div className='flex gap-2'>
                  <Input type="text" placeholder='Add a Comment...' className='w-full outline-none border border-gray ' value={commentText} onChange={changeEventHandler}></Input>
                  <Button disabled={!commentText.trim()} onClick={commentHandler} variant="outline">Send</Button>
                </div></div>

            </div>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentDialog