import { useNavigate } from "react-router-dom"

export default function Navbar() {

  const navigate = useNavigate();

  return (
    <div className="border flex justify-between mb-10 w-screen absolute top-5 items-center">
      <img src="../public/logo.jpeg" alt="" className="w-14"/>

      <button onClick={() => {navigate('/login')}}
      className="border w-[8%] sm:w-[12%] h-[50px] rounded-3xl text-[20px] cursor-pointer hover:bg-gray-100 transition-all px-2 py-2 gap-2 md:text-[12px] overflow-hidden">Login</button>


    </div>
  )
}