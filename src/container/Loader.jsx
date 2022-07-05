import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const Loader = () => {
  return (
    <div className='bg-hero flex h-screen flex-col justify-center items-center w-full'>
      <BiLoaderAlt size={40} className="spinner-border animate-spin inline-block rounded-full" />
    </div>
  )
}

export default Loader;