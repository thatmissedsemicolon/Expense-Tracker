import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/userContext';
import ReactPaginate from 'react-paginate';
import { getDatabase, ref, child, get, remove, update } from "firebase/database";
import { AiFillDelete } from 'react-icons/ai';
import { IoMdSearch } from 'react-icons/io';
import { BiLoaderAlt } from 'react-icons/bi';
import Fuse from 'fuse.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';
import { searchCategories } from '../utils/data';

const AllExpenses = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState([]);
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toolTip, setToolTip] = useState(false);
  const { user, year, month } = useUserContext();

  document.title = "All Expenses";

  const expensesPerPage = 10
  const pagesVisited = pageNumber * expensesPerPage;

  const pageCount = Math.ceil((length?.length || 0) / expensesPerPage);

  const changePage = ({selected}) => {
    setPageNumber(selected);
  }

  const options = {
    keys: [
      "type",
    ]
  };

  const fuse = new Fuse(searchCategories, options);

  const searchResult = fuse.search(searchTerm).map((index) => index?.item).map((index) => index?.type)?.[0];

  const search = () => {
    setData([]);
    setLength(0);
    setLoading(true);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `${user?.uid}/${year}/Search/${year}/${searchResult.toLocaleLowerCase()}`)).then((snapshot) => {
      if (snapshot.exists()) {
       setData(Object.values(snapshot.val()).reverse())
       setLength(Object.values(snapshot.val()))
       setLoading(false);
      }
    })
  }

  const getExpenseData = () => {
    setLoading(true);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `${user?.uid}/${year}/All`)).then((snapshot) => {
      if (snapshot.exists()) {
        setData(Object.values(snapshot.val()).reverse())
        setLength(Object.values(snapshot.val()))
        setLoading(false);
      }
    })
  }

  const deleteExpense = (type, category, date, amount, transactionid, timestamp) => {
    const deleteExpenseYear = date.slice(0,4);
    const expenseMonth = date.slice(6,7);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const deleteExpenseMonth = (months?.[expenseMonth - 1])
    const dbRef = ref(getDatabase());
    const db = getDatabase();
    remove(child(dbRef, `${user?.uid}/${deleteExpenseYear}/${deleteExpenseMonth}/${type}/${category}/${transactionid}`))
    remove(child(dbRef, `${user?.uid}/${deleteExpenseYear}/Search/${deleteExpenseYear}/${category.toLocaleLowerCase()}/${timestamp}`))
    remove(child(dbRef, `${user?.uid}/${deleteExpenseYear}/All/${timestamp}`))
    .then(() => {
        get(child(dbRef, `${user?.uid}/${deleteExpenseYear}/${type}`)).then((snapshot) => {
            if (snapshot.exists()) {
                update(ref(db, `${user?.uid}/${deleteExpenseYear}/${type}/${type}`), {
                    total: Object.values(snapshot.val()).map((index) => index?.total)?.[0] - amount,
                })
            }
        })
        get(child(dbRef, `${user?.uid}/${deleteExpenseYear}/${deleteExpenseMonth}/${type}/${category}/Total`)).then((snapshot) => {
            if (snapshot.exists()) {
                update(ref(db, `${user?.uid}/${deleteExpenseYear}/${deleteExpenseMonth}/${type}/${category}/Total`), {
                    total: Object.values(snapshot.val())?.[0] - amount,
                })
            }
        })
        get(child(dbRef, `${user?.uid}/${deleteExpenseYear}/${deleteExpenseMonth}/${type}/Category/${category}`)).then((snapshot) => {
            if (snapshot.exists()) {
                update(ref(db, `${user?.uid}/${deleteExpenseYear}/${deleteExpenseMonth}/${type}/Category/${category}`), {
                    total: Object.values(snapshot.val())?.[1] - amount,
                })
            }
        })

        getExpenseData();
        
        toast.success("Transaction Successfully Deleted!")
    }).catch(() => {
        toast.error('An error occured while processing your request!')
    })
  }

  useEffect(() => {
    if(searchResult){
      search();
    }
    else {
      getExpenseData();
    }
  },[searchResult, month, year, user?.uid])

  return (
    <>
        <div className="bg-hero p-8 overflow-hidden h-screen">
            <div>
                <ToastContainer />
                <div className='flex items-center justify-between pb-6 gap-5'>
                    <div className='bg-gray-900 rounded-md p-2'>
                        <h2 className="text-white font-semibold text-sm md:text-sm lg:text-sm xl:text-lg 2xl:text-lg">All 2022 Expenses</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex bg-gray-900 items-center p-2 rounded-md text-gray-100">
                            <IoMdSearch fontSize={21} className="ml-1 text-gray-100 text-bold" />
                            <input onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-900 text-gray-100 text-bold outline-none ml-1 block " type="text" name="Search" id="Search" placeholder="Search by Categories..." />
                        </div>
                    </div>
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Transcation ID
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <>
                                {data.slice(pagesVisited, pagesVisited + expensesPerPage).map((index) => (
                                    <tr>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className={index?.type === "Income" ? "text-green-500 whitespace-no-wrap font-bold" : "text-red-500 whitespace-no-wrap font-bold" }>{index?.type}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{index?.category} </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className={index?.type === "Income" ? "text-green-500 whitespace-no-wrap font-bold" : "text-red-500 whitespace-no-wrap font-bold" }>{index?.type === "Income" ? "+$" : "-$"}{index?.type === "Income" ? (index?.income) : index?.income}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{index?.date}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{index?.transactionid}</p>
                                        </td>
                                        <td onMouseEnter={() => setToolTip(true)} onMouseLeave={() => setToolTip(false)} className="cursor-pointer px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {toolTip && <ReactTooltip />}
                                            <p onClick={(e) => {e.stopPropagation(); deleteExpense(index?.type, index?.category, index?.date, index?.income, index?.transactionid, index?.timestamp)}} data-tip="Delete Expense" className="text-gray-900 whitespace-no-wrap"><AiFillDelete size={24} /></p>
                                        </td>
                                    </tr>
                                ))}
                                </>
                            </tbody>
                        </table>
                        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            {loading && <BiLoaderAlt size={40} className="spinner-border animate-spin inline-block rounded-full mb-2" />}
                            <span className="text-xs xs:text-sm text-gray-900">Showing {pagesVisited} to {pagesVisited + expensesPerPage} of {length?.length} results</span>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <ReactPaginate 
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                previousClassName="m-2 relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                nextClassName="m-2 bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                disabledClassName={"paginationDisabled"}
                                activeClassName="m-2 z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                />
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default AllExpenses;