import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegHeart, FaHeart, FaBookmark } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { setAuthUser } from "@/redux/authSlice";
import { Link } from "react-router-dom";


// Assuming you have an auth slice to manage user data

function Post({ post }) {
  const [commentText, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const {selectedPost, posts } = useSelector(store => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [comment, setComment] = useState(post.comments);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [bookmark, setBookmark] = useState(user?.bookmarks?.includes(post?._id) || false);
 
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim());
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`https://instagram-clone-7akg.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setLiked(!liked);
        setPostLike(updatedLikes);
        toast.success(res.data.message);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the like status.");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://instagram-clone-7akg.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPostData = posts.filter(postItem => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`https://instagram-clone-7akg.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        setBookmark(!bookmark);
        toast.success(res.data.message);

        // Update user bookmarks in the global state
        const updatedUser = {
          ...user,
          bookmarks: bookmark
            ? user.bookmarks.filter(id => id !== post._id)
            : [...user.bookmarks, post._id],
        };
        dispatch(setAuthUser(updatedUser));
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the bookmark status.");
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
    <div className='my-8 w-full max-w-sm flex flex-col'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
           <Link to={`/profile/${post?.author?._id}`}><AvatarImage className="cursor-pointer" src={post?.author?.profilePicture} alt="profile_picture" /></Link> 
          <Link to={`/profile/${post?.author?._id}`}><AvatarFallback className="cursor-pointer"><img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" /> </AvatarFallback></Link>  
          </Avatar>
          <h2 className="font-semibold cursor-pointer no-underline hover:underline">
           <Link to={`/profile/${post?.author?._id}`}> {post?.author?.username}</Link>
          </h2>
        </div>

        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
            <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
            {user && user._id === post?.author._id &&
              <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
            }
          </DialogContent>
        </Dialog>
      </div>

      <img className="rounded-sm my-2 w-full aspect-square object-cover" src={post?.image} alt="post_image" />

      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <button onClick={likeOrDislikeHandler} className="cursor-pointer hover:text-gray-600">
            {liked ? <FaHeart size={'22px'} className="text-red-500" /> : <FaRegHeart size={'22px'} />}
          </button>
          <MessageCircle className="cursor-pointer hover:text-gray-600" onClick={() => {
                       dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <div>
          {bookmark ?
            <FaBookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600 text-xl" />
            :
            <CiBookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600 text-2xl" />
          }
        </div>
      </div>

      <div className="flex mt-1">
        <span className="font-medium block">{postLike} likes</span>
      </div>

      <div className="flex">
        <p>
          <span className="mr-2 font-semibold">{post?.author?.username}</span>
          {post?.caption || ""}
        </p>
      </div>

      <div className="flex">
        <span onClick={() => {
          
          setOpen(true);
        }} className="text-gray-500 text-sm cursor-pointer">
          View all {post?.comments?.length || 0} comments
        </span>
      </div>

      <CommentDialog open={open} setOpen={setOpen} post={post} />

      <div className="flex items-center justify-center mt-2">
        <input
          type="text"
          placeholder="Type a comment..."
          className="outline-none text-sm w-full"
          value={commentText}
          onChange={changeEventHandler}
        />
        {commentText && <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>

      <div className="my-5">
        <hr />
        <hr />
      </div>
    </div>
  );
}

export default Post;
