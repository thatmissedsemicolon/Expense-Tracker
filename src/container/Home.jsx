import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import { Dashboard, AddExpense, AllExpenses } from '../components';

const Home = () => {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/AddExpense' element={<AddExpense />} />
        <Route path='/AllExpenses' element={<AllExpenses />} />
      </Routes>
    </>
  )
}

export default Home;