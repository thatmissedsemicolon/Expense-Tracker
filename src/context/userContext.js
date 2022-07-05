import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const UserContext = createContext({})

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const authStateChanged = () => {
            setLoading(true);
            const unsubscribe = onAuthStateChanged(auth, res => {
                res ? setUser(res) : setUser(null);
                setError("");
                setLoading(false);
            });
    
            return unsubscribe;
        }
        
        authStateChanged();
    },[])

    useEffect(() => {
        const getMonth = () => {
          const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
          const d = new Date();
          let name = months[d.getMonth()];
          
          setMonth(name);
        }
    
        const getYear = () => {
          const year = new Date().getFullYear();
    
          setYear(year);
        }
     
        getMonth();
        getYear();
    },[])

    const signUpUser = ( firstName, lastName, email, password ) => {
        setLoading(true);
        createUserWithEmailAndPassword( auth, email, password)
        .then(() => {
            updateProfile(auth.currentUser, {
                displayName: firstName + ' ' + lastName
            })
            toast.success('Account Successfully Created!')
        })
        .catch((err) => {setError(`${err.code}`); setLoading(false)})
        .finally(() => {navigate('/login'); setLoading(false)})
    };

    const signInUser = ( email, password ) => {
        setLoading(true);
        signInWithEmailAndPassword( auth, email, password)
        .then(() => {setLoading(false); localStorage.setItem('user', JSON.stringify(`${auth?.currentUser?.email}`))})
        .catch((err) => {setError(`${err.code}`); setLoading(false)})
    };

    const logOut = () => {
        setLoading(true);
        signOut(auth)
        .then(() => {setLoading(false); localStorage.clear()})
        .catch((err) => setError(`${err.code}`))
    }

    const forgotPassword = ( email ) => {
        sendPasswordResetEmail(auth, email)
        .then(() => {toast.success("Check your email!")})
        .catch((err) =>  setError(`${err.code}`))
    }; 


    const contextValue = {
        user,
        error,
        loading,
        month,
        year,
        signInUser,
        signUpUser,
        logOut,
        forgotPassword,
    }

    return (
        <>
          <UserContext.Provider value={contextValue}> {children} </UserContext.Provider>
          <ToastContainer />
        </>
    )
}