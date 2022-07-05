import React, { useEffect, useState } from 'react';
import { type, incomeCategories, expenseCategories } from '../utils/data';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, child, get, set} from "firebase/database";
import { useUserContext } from '../context/userContext';

const AddExpense = () => {
  const [formData, setFormData] = useState({ expenseType : '' , category: '' , date : '', amount : 0 });
  const [total, setTotal] = useState(0);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpense, setYearlyExpense] = useState(0);
  const { user, month, year } = useUserContext();

  document.title = "Add Expense";

  const transactionid = uuidv4().slice(0,5);

  const timestamp = Math.floor(Date.now() / 1000);

  const { expenseType, category, date, amount } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData({...formData, [name]: value});
  }

  const createExpense = (e) => {
    e.preventDefault();
    
    if (expenseType && category && date && amount ) {
      const db = getDatabase();
      set(ref(db, `${user?.uid}/${year}/All/${timestamp}`), {
        type : expenseType,
        category: category,
        date : date,
        income: Number(amount),
        transactionid : transactionid,
        timestamp: timestamp,
      })
      set(ref(db, `${user?.uid}/${year}/${month}/${expenseType}/${category}/${transactionid}`), {
        type : expenseType,
        category: category,
        date : date,
        income: Number(amount),
        transactionid : transactionid,
        timestamp: timestamp,
      })
      set(ref(db, `${user?.uid}/${year}/Search/${year}/${category.toLocaleLowerCase()}/${timestamp}`), {
        type : expenseType,
        category: category,
        date : date,
        income: Number(amount),
        transactionid : transactionid,
        timestamp: timestamp,
      })
      set(ref(db, `${user?.uid}/${year}/${month}/${expenseType}/Category/${category}`), {
        category: category,
        total: total + Number(amount),
      })
      set(ref(db, `${user?.uid}/${year}/${month}/${expenseType}/${category}/Total`), {
        total: total + Number(amount),
      })

      if(expenseType === "Income") {
        set(ref(db, `${user?.uid}/${year}/Income/Income`), {
          total: yearlyIncome + Number(amount),
        })
      } else {
        set(ref(db, `${user?.uid}/${year}/Expense/Expense`), {
          total: yearlyExpense + Number(amount),
        })
      }
       
      setFormData("");
      toast.success(`Successfully Created Transaction ID: ${transactionid}`);
    } else if (!expenseType && !category && !date && !amount) {
      toast.error("All fields are required!")
    } else {
      toast.error("Transaction already added!")
    }
  }

  useEffect(() => {
    const getData = () => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `${user?.uid}/${year}/${month}/${expenseType}/${category}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setTotal(Object.values(snapshot.val()).map((index) => index?.income).filter((index) => index !== undefined).reduce((a , i) => a += i, 0));
          console.log(Object.values(snapshot.val()).map((index) => index?.income).filter((index) => index !== undefined).reduce((a , i) => a += i, 0))
        }
        else {
          setTotal(0);
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

    getData();
  },[expenseType, category, user?.uid, month, year])

  console.log(Number(total) + Number(amount))

  return (
    <div className='bg-hero flex flex-col justify-center items-center h-screen'>
      <div className='mx-auto flex-col flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full max-w-xl space-y-8">
          <ToastContainer />
          <h3 className='text-center text-gray-900 font-bold text-3xl'>Add Expense</h3>
          <div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2">
                <div className="w-full px-3">
                  <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Type
                  </span>
                  <div className="relative">
                    <select type="expenseType" onChange={handleChangeInput} value={expenseType} name= "expenseType" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required >
                      {type.map((index) => (
                        <option>{index}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
              {expenseType &&
                <div className="w-full md:w-1/2 px-3">
                  <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Category
                  </span>
                  <div className="relative">
                    {expenseType === "Income" ? (
                      <select type="category" onChange={handleChangeInput} name="category" value={category}  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required >
                      {incomeCategories.map((index) => (
                        <option>{index?.type}</option>
                      ))}
                      </select>
                    ):(
                      <select type="category" onChange={handleChangeInput} name="category" value={category}  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required >
                        {expenseCategories.map((index) => (
                          <option>{index?.type}</option>
                        ))}
                      </select>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3">
                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                  Amount
                </span>
                <input type="amount" onChange={handleChangeInput} name="amount" value={amount} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="start">Date</span>
                <input type="date" onChange={handleChangeInput} name="date" value={date} min="2022-01-01" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required />
              </div>
            </div>
            <br />
            <button
              type="submit"
              onClick={createExpense}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-[#8b0000]focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
              >
                Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddExpense;