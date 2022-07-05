import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

const ForgotPassword = () => {
  const emailRef = useRef();
  const { forgotPassword, error } = useUserContext();

  const onSubmit = (e) => {
    e.preventDefault();

    const email = emailRef.current.value;

    if (email) {
      forgotPassword(email);
      emailRef.current.value = "";
    }
  }

  return (
    <div className='bg-hero items-center justify-center flex flex-col h-screen'>
      <div className='bg-blackOverlay absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0'>
        <div className='flex flex-col items-center justify-center mx-auto h-screen py-12 px-4 sm:px-6 lg:px-8'>
          <div className='bg-gray-900 px-6 py-8 rounded shadow-md space-y-8 max-w-md text-black w-full'>
            <div>
              <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-100'> Reset Your Password </h2>
            </div>
            <form onSubmit={onSubmit}>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                    Email
                  </span>
                  <input ref={emailRef} id="email-address" name="email" type="email" autoComplete="email" placeholder='Email Address*' className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required />
                </div>
              </div>
              <button type="submit" className="group relative w-full mt-8 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Send Instructions
              </button>
            </form>
            <p class="mt-8 text-center font-semibold text-red-700">{error}</p>
            <hr class="my-6 border-gray-300 w-full" />
            <p class="mt-8 text-center text-gray-100"><Link to ="/login" class="text-blue-500 hover:text-blue-700 font-semibold">Back to Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;