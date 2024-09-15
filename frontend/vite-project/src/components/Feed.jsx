import React, { useState } from 'react'
import Post from './Posts'
import { HiMenuAlt1 } from "react-icons/hi";
import Leftsidebar from './Leftsidebar';

function Feed() {
  const [openMenu,setOpenMenu]=useState(0);
  return (
    <>
    <div className='flex  items-center fixed z-10 bg-white border-b-2 border-b-grey-400 w-full p-4 md:hidden xl:hidden  '>
    <span className='text-4xl   md:hidden xl:hidden' onClick={()=>setOpenMenu(true)}><HiMenuAlt1 /></span>
    <h2 className='text-2xl underline italic font-serif ml-32 fixed font-bold  md:hidden xl:hidden '>Instagram</h2>
   
    </div>
    
    <div className='flex-1 my-4 md:my-6 xl:my-8 flex-col items-center md:pl-[26%] xl:pl-[26%] sm:pl-0' >
      <Post/>
      <Leftsidebar openMenu={openMenu} setOpenMenu={setOpenMenu}/>
    </div>
    </>
  )
}

export default Feed