import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { MdOutlineCancel } from 'react-icons/md';
import { useUserContext } from "../context/userContext";
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const { user, logOut } = useUserContext();

  const [firstName, lastName] = (`${user?.displayName}`).split(/\s+(.*)/);
  
  const profileImage = `https://ui-avatars.com/api/?name=${firstName} + ${lastName}`

  return (
    <>
      <button
        className="bg-gray-200 flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:text-gray-200 hover:bg-gray-300"
        onClick={() => setToggle(true)}
      >
        <img
          className="rounded-full w-8 h-8 pointer-events-none"
          src={profileImage}
          alt="user-profile"
        />
        <p>
          <span className="text-gray-600 text-14">Hi,</span>{' '}
          <span className="text-gray-600 font-bold ml-1 text-14">
            {firstName}
          </span>
        </p>
        <MdKeyboardArrowDown className="text-gray-400 text-14" />
      </button>

      {toggle &&
        <div className="absolute right-1 top-16 bg-gray-900 p-8 rounded-lg w-96 z-50">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-lg text-gray-100">User Profile</p>
              <button onClick={() => setToggle(false)}> 
                <span className="text-3xl p-2 px-6 pt-4 h-96 font-semibold text-gray-100">
                <MdOutlineCancel />
                </span>
              </button>
          </div>
          <div onClick={() => setToggle(false)} className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
            <img
              className="rounded-full cursor-pointer h-24 w-24 pointer-events-none"
              src={profileImage}
              alt="user-profile"
            />
            <div>
              <p className="font-semibold cursor-pointer text-xl text-gray-100" onClick={() => setToggle(false)} > {user?.displayName} </p>
              <p className="cursor-pointer text-sm font-semibold text-gray-300" onClick={() => setToggle(false)}> {user?.email} </p>
            </div>  
          </div>
          <div className="mt-5">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2  rounded-full"
              onClick={() => {logOut(); navigate('/login')}}
            >
              Logout
            </button>
          </div>
        </div>
      }
    </>
  )
}

export default UserProfile;