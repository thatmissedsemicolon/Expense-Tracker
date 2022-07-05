import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

const Login = () => {

  const emailRef = useRef();
  const passwordRef = useRef();
  const { signInUser, error } = useUserContext();

  document.title = "Sign In"

  const onSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if(email && password) {
        signInUser(email, password);
    }
  }

  return (
    <div className='bg-hero flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
            <div className='bg-blackOverlay absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0'>
                <div className='flex flex-col items-center justify-center mx-auto h-screen py-12 px-4 sm:px-6 lg:px-8'>
                    <div className='bg-gray-900 px-6 py-8 rounded shadow-md space-y-8 max-w-md text-black w-full'>
                        <div>
                            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-100'>Sign in to your account</h2>
                        </div>
                        <form onSubmit={onSubmit} className="mt-8 space-y-6">
                            <input type="hidden" name="remember" defaultValue="true" />
                            <div className='rounded-md shadow-sm -space-y-px'>
                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email</label>
                                    <input ref={emailRef} id="email-address" name="email" type="email" autoComplete="email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm" placeholder="Email address" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                    Password
                                    </label>
                                    <input ref={passwordRef} id="password" name="password" type="password" autoComplete="current-password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm" placeholder="Password" required />
                                </div>
                            </div>
                            <div className='flex items-center justify-end'>
                                <div class="text-sm">
                                    <Link to="/forgotpassword" class="font-medium text-indigo-600 hover:text-indigo-500"> Forgot your password? </Link>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                    </span>
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <p class="mt-8 text-center font-semibold text-red-700">{error}</p>
                        <hr class="my-6 border-gray-300 w-full" />
                        <p class="mt-8 text-center text-gray-100">Don't have an account? <Link to ="/signup" class="text-blue-500 hover:text-blue-700 font-semibold">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login;