import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className='w-fit my-6 pr-30  hidden lg:block'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className='flex justify-center gap-4 items-center'>
          <h1 className='font-semibold text-sm ml-2'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
           <a href="/logout" className='pl-7 text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Logout</a>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar