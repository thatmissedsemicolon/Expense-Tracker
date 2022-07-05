import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineAddCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Hamburger from "hamburger-react";
import { UserProfile } from '../components';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-[#0a192f] border-gray-200 z-50 shadow-lg md:px-8 px-1 w-full top-0 sticky">
        <div className='flex justify-between items-center py-2 md:py-4 md:px-2 pl-2 mx-auto'>
          <div className='flex items-center cursor-pointer'>
            <a href='/' className='hidden lg:block text-xl font-medium text-decoration-none whitespace-nowrap text-[#64ffda]'>
              <h1 className='text-xl font front-medium'>{`EXPENSE TRACKER`}</h1>
            </a>
            <div className='visible lg:hidden'>
              <UserProfile />
            </div>
          </div>
          <div className='hidden justify-between items-center w-full lg:flex lg:w-auto cursor-pointer gap-10'>
            <button onClick={() => navigate('/AllExpenses')} class="bg-green-400 hover:bg-green-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
              <AiOutlineSearch size={24} />
              <span className='ml-4'> ALL EXPENSES </span>
            </button>
            <button onClick={() => navigate('/AddExpense')} class="bg-blue-400 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
              <MdOutlineAddCircle size={24} />
              <span className='ml-4'> ADD EXPENSE </span>
            </button>
            <UserProfile />
          </div>
          <div className="flex lg:hidden items-center">
            <Hamburger
              toggled={ toggle }
              size={ 22 }
              duration={ 0.8 }
              distance={ "lg" }
              toggle={ setToggle }
              color={"#64ffda" }
            />
          </div>
        </div>
      </nav>
      {toggle && (
        <div className="w-screen h-full fixed top-0 right-0 z-50 backdrop-blur-lg">
          <div
            className="bg-[#112240] flex flex-col py-6 text-2xl fixed inset-y-0 right-0 h-screen w-4/5 overflow-y-auto shadow-md z-10 animate-slide-in justify-center items-center"
          >
            <ul class="lg:hidden lg:flex-row lg:space-y-8 lg:mt-0 lg:text-md lg:font-medium">
              <div className='absolute top-2 right-2'>
                <Hamburger
                  toggled={ toggle }
                  size={ 22 }
                  duration={ 0.8 }
                  distance={ "lg" }
                  toggle={ setToggle }
                  color={"#64ffda" }
                />
              </div>
              <div className='flex flex-wrap justify-center items-center w-full cursor-pointer'>
                <button onClick={() => {navigate('/AllExpenses'); setToggle(false);}} class="text-green-500 font-bold py-2 px-4 rounded inline-flex items-center mb-4">
                  <AiOutlineSearch size={24} />
                  <span className='ml-4'> ALL EXPENSES </span>
                </button>
                <button onClick={() => {navigate('/AddExpense'); setToggle(false);}} class="text-blue-500 font-bold py-2 px-4 rounded inline-flex items-center mb-4">
                  <MdOutlineAddCircle size={24} />
                  <span className='ml-4'> ADD EXPENSE </span>
                </button>
              </div>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar;