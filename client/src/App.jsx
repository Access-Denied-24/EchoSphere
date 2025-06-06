import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ResetPass from "./Pages/ResetPass";
import EmailVerify from "./Pages/EmailVerify";
import { ToastContainer, toast } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/reset-password',
    element: <ResetPass />
  },
  {
    path: '/email-verify',
    element: <EmailVerify />
  },
  {
  }
]);


export default function App(){

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  )
}