import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post);
  
  return (
    <div className='pl-6 mt-20'>
       {posts && Array.isArray(posts) ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No posts available</p>  // Show this message if posts is null or not an array
      )}
    </div>
  );

}

export default Posts