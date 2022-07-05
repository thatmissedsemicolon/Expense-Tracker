import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useUserContext } from './context/userContext';
import Home from './container/Home';
import { Login, Signup, ForgotPassword } from './auth';
import { fetchUser } from './utils/fetchUser';
import Loader from './container/Loader';

const App = () => {

  const { loading } = useUserContext(); 
  const navigate = useNavigate();

  const user = fetchUser();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  },[user])

  if(loading) return <Loader /> 
  
  return (
    <Routes>
      {user && 
        <Route path = '/login' element = {<Navigate replace to="/" />}/>
      }
      <Route path ='/login' element={<Login />} />
      <Route path="/signup" element= {<Signup />}/>
      <Route path="/forgotpassword" element= {<ForgotPassword />}/>
      <Route path='/*' element={<Home />} />
    </Routes>
  )
}

export default App;