import Header from "../Components/Header";
import Navbar from "../Components/Navbar";

export default function Home(){
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('../bg_img.png')] bg-cover bg-center border-2">
      {/* <h1>Home Page</h1> */}
      <Navbar />
      <Header />
    </div>
  )
}