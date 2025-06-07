import { useContext, useState } from "react"
import { useAsyncError, useNavigate } from "react-router-dom";
import { AppContent } from "../Context/AppContext";
import axios from 'axios'
import { toast } from "react-toastify";

export default function Login(){

  const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContent);

  const navigate = useNavigate();
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async(e) =>{
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true; // sends cookies with api requests

      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password});

        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/')
        }
        else toast.error(data.message);
      }
      else{
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password});

        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/')
        }
        else toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      {/* <h1>Login Page</h1> */}
      <img src="/public/logo.jpeg" alt="" 
      onClick={() => {navigate('/')}}
      className="absolute left-5 top-5 sm:left-20 w-18 sm:w-25 cursor-pointer"/>

      <div className="border bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl text-center text-white font-semibold mb-4">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>

        <p className="text-sm text-center mb-6">
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={onSubmitHandler}>

          {state === 'Sign Up' && (
            <div className="flex gap-3 border items-center w-full mb-4 px-5 py-3 rounded-full bg-[#333A5C]">
              <img src="/public/person_icon.svg" alt="" className=""/>

              <input onChange={e => {setName(e.target.value)}} value={name}
              type="text" placeholder="Username" className="bg-transparent outline-none w-full" required/>
            </div>
          )}


          <div className="flex gap-3 border items-center w-full mb-4 px-5 py-3 rounded-full bg-[#333A5C]">
            <img src="/public/mail_icon.svg" alt="" className=""/>

            <input onChange={e => {setEmail(e.target.value)}} value={email}
            type="email" placeholder="Email ID" className="bg-transparent outline-none w-full" required/>
          </div>

          <div className="flex gap-3 border items-center w-full mb-4 px-5 py-3 rounded-full bg-[#333A5C]">
            <img src="/public/lock_icon.svg" alt="" className=""/>

            <input onChange={e => {setPassword(e.target.value)}} value={password}
            type="password" placeholder="Password" className="bg-transparent outline-none w-full" required/>
          </div>

          {/* <p>Forgot Password</p> */}

          <div className="flex justify-between mb-4">
            <span onClick={() => {navigate('/reset-password')}}
            className="text-sm hover:underline cursor-pointer">Forgot Password</span>
            
          </div>

          <div className=" text-center h-10 items-center">
            {/* <button>{state === 'Sign Up' ? 'Sign Up' : 'Login'}</button> */}
            <button className="rounded-full w-full items-center py-2.5 cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white">
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
            </button>

          </div>

          {/* <div className="flex gap-3 border items-center w-full mb-4 px-5 py-3 rounded-full bg-[#333A5C]">
            <img src="/public/lock_icon.svg" alt="" className=""/>

            <input type="text" placeholder="Confirm Password" className="bg-transparent outline-none w-full" required/>
          </div> */}

            {/* <input type="text" placeholder="Enter Username" className="border rounded-full text-center"/>
            <input type="password" placeholder="Enter Password" className="border rounded-full text-center"/>
            <input type="password" placeholder="Confirm Password" className="border rounded-full text-center"/> */}

        </form>
        
        {state === 'Sign Up' ? (
          <p className="text-gray-400 text-center text-xs mt-4"> Already have an account? {' '}
          <span onClick={() => {setState('Login')}}
            className="text-blue-400 underline cursor-pointer">Login here</span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4"> Don't have an account? {' '}
          <span onClick={() => {setState('Sign Up')}}
            className="text-blue-400 underline cursor-pointer">Sign up</span>
          </p>
        )}


      </div>

    </div>
  )
}