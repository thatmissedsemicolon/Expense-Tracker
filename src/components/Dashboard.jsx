import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { getDatabase, ref, child, get } from "firebase/database";
import { useUserContext } from '../context/userContext';
import { incomeColors, expenseColors } from '../utils/data';
import { AiFillDollarCircle } from 'react-icons/ai';
import millify from 'millify';

const Dashboard = () => {
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryIncomeTotal, setCategoryIncomeTotal] = useState([]);
  const [incomeCategory, setIncomeCategory] = useState([]);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpense, setYearlyExpense] = useState(0);
  const [transaction, setTransaction] = useState([]);
  const { user, month, year } = useUserContext();

  document.title = "Dashboard";

  const YearlyIncomePercentage = yearlyExpense && yearlyIncome !== 'undefined' ? millify((yearlyExpense/yearlyIncome)*100) : 0;

  const incomeData = {
    datasets: [{
      data: categoryIncomeTotal,
      backgroundColor: incomeColors,
    }],
    labels: incomeCategory,
  };

  const expenseData = {
    datasets: [{
      data: categoryTotal,
      backgroundColor: expenseColors,
    }],
    labels: category,
  };

  useEffect(() => {
    const getExpenseData = () => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `${user?.uid}/${year}/${month}/Expense/Category`)).then((snapshot) => {
        if (snapshot.exists()) {
          setCategoryTotal(Object.values(snapshot.val()).map((index) => index?.total).filter((index) => index !== undefined))
        }
      })
      get(child(dbRef, `${user?.uid}/${year}/${month}/Expense/Category`)).then((snapshot) => {
        if (snapshot.exists()) {
          setCategory(Object.values(snapshot.val()).map((index) => index?.category))
        }
      })
      get(child(dbRef, `${user?.uid}/${year}/${month}/Expense/Category`)).then((snapshot) => {
        if (snapshot.exists()) {
          setExpense(Object.values(snapshot.val()).map((index) => index?.total).filter((index) => index !== undefined).reduce((a, i) => a += i, 0))
        }
      })
    }

    const getIncomeData = () => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `${user?.uid}/${year}/${month}/Income/Category`)).then((snapshot) => {
        if (snapshot.exists()) {
          setCategoryIncomeTotal(Object.values(snapshot.val()).map((index) => index?.total).filter((index) => index !== undefined))
        }
      })
      get(child(dbRef, `${user?.uid}/${year}/${month}/Income/Category`)).then((snapshot) => {
        if (snapshot.exists()) {
          setIncomeCategory(Object.values(snapshot.val()).map((index) => index?.category))
        }
      })
      get(child(dbRef, `${user?.uid}/${year}/${month}/Income/Category`)).then((snapshot) => {
        if (snapshot.exists()) {
          setIncome(Object.values(snapshot.val()).map((index) => index?.total).filter((index) => index !== undefined).reduce((a, i) => a += i, 0))
        }
      })
      get(child(dbRef, `${user?.uid}/${year}/Income`)).then((snapshot) => {
        if (snapshot.exists()) {
          setYearlyIncome(Object.values(snapshot.val()).map((index) => index)?.[0]?.total);
        }
        else {
          setYearlyIncome(0);
        }
      })
      get(child(dbRef, `${user?.uid}/${year}/Expense`)).then((snapshot) => {
        if (snapshot.exists()) {
          setYearlyExpense(Object.values(snapshot.val()).map((index) => index)?.[0]?.total);
        }
        else {
          setYearlyExpense(0);
        }
      })
    }

    getExpenseData();
    getIncomeData();
  },[month, user?.uid, year])

  useEffect(() => {
    const getExpenseData = () => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `${user?.uid}/${year}/All`)).then((snapshot) => {
        if (snapshot.exists()) {
          setTransaction(Object.values(snapshot.val()).reverse())
        }
      })
    }

  getExpenseData();
  },[user?.uid, year])

  return (
    <div className="bg-hero h-screen items-center justify-center overflow-auto">
      <div className="flex flex-wrap justify-center">
        <div className="flex gap-10 flex-wrap justify-center">
          <div className="bg-gray-900 text-gray-200 m-3 p-4 rounded-2xl md:w-780">
            <div className="flex justify-center">
              <p className="font-semibold text-xl">{year} Expense Tracker</p>
            </div>
            <div className="mt-10 grid gap-10 grid-cols-2 justify-center">
              <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">${yearlyIncome}</span>
                </p>
                <p className="text-gray-500 mt-1">Yearly Income</p>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-semibold">${yearlyExpense}</p>
                <p className="text-gray-500 mt-1">Yearly Expense</p>
              </div>
              </div>
              <div className="border-r-1 border-color m-4 pr-10">
              <div className="mt-8">
                <p className="text-3xl font-semibold text-center">${yearlyIncome - yearlyExpense} <span className={YearlyIncomePercentage <= 50 ? "p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-500 ml-2 text-xs" : "p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-red-500 ml-2 text-xs"}>{YearlyIncomePercentage}% </span></p>
                <p className="text-gray-500 mt-1">Net Yearly Income</p>
              </div>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl md:w-400 p-4 m-3 bg-green-500">
              <div className="flex justify-between items-center gap-10">
                <p className="font-semibold text-white text-2xl">{month} Income</p>
                <div>
                  <p className="text-2xl text-white font-semibold mt-8 text-center">${income}</p>
                  <p className="text-gray-200">Monthly Income</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-red-500 rounded-2xl md:w-400 p-4 m-3">
              <p className="font-semibold text-white text-2xl">{month} Expense</p>
              <div>
                <p className="text-2xl text-white font-semibold mt-8 text-center">${expense}</p>
                <p className="text-gray-200">Monthly Expense</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex m-3 flex-wrap justify-center gap-10 items-center">
        <div className="bg-gray-100 text-gray-200 p-6 rounded-2xl">
          <p className='text-center text-xl font-bold text-gray-900'>Income</p>
          <Doughnut data={incomeData} />
        </div>
        <div>
          <div className="flex gap-10 m-4 flex-wrap justify-center">
            <div className="bg-gray-900 text-gray-200 p-6 rounded-2xl">
              <div className="flex justify-between items-center gap-2">
                <p className="text-xl font-semibold">Recent Transactions</p>
              </div>
              <div className="mt-10 w-72 md:w-400">
                {transaction.slice(0, 5).map((index,i) => (
                  <div className="flex justify-between mt-4" key={i}>
                    <div className="flex gap-4">
                      {index?.type === "Income" ? <AiFillDollarCircle size={32} className="bg-green-600" /> : <AiFillDollarCircle size={32} className="bg-red-600" />}
                      <div>
                        <p className="text-md font-semibold">{index?.category}</p>
                        <p className="text-sm text-gray-400">{index?.date}</p>
                      </div>
                    </div>
                    <p className={index?.type === "Income" ? "text-green-500 whitespace-no-wrap font-bold" : "text-red-500 whitespace-no-wrap font-bold" }>{index?.type === "Income" ? "+$" : "-$"}{index?.type === "Income" ? (index?.income) : index?.income}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center mt-5 border-t-1 border-color">
                <p className="text-gray-400 text-sm">Showing 5 Recent Transactions</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 text-gray-200 p-6 rounded-2xl">
          <p className='text-xl font-bold text-center text-gray-900'>Expense</p>
          <Doughnut data={expenseData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;