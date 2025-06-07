import { useContext } from "react"
import { AppContent } from "../Context/AppContext";

export default function Header() {
  const {userData} = useContext(AppContent);

  return (
    <div>
      {/* add website intro */}
      <div className="flex text-center flex-col border h-100 w-screen">
        <h1 className="text-center text-3xl mb-4 font-semibold">Welcome to EchoSphere, {userData ? userData.name : 'Amigo'}!</h1>
        {console.log(userData.name)}

        <p className="mb-20 text-[15px]">
          {userData ? 'Explore our website' : 'Begin by creating an account'}
          
        </p>

        <button className="text-2xl border rounded-full w-[20%] h-[20%] self-center cursor-pointer hover:bg-gray-100 transition-all">Get Started</button>
      </div>
    </div>
  )
}