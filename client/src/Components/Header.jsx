export default function Header() {
  return (
    <div>
      {/* add website intro */}
      <div className="flex text-center flex-col border h-100 w-screen">
        <h1 className="text-center text-3xl mb-4">Welcome to EchoSphere</h1>

        <p className="mb-20 text-[15px]">Begin by creating an account</p>

        <button className="text-2xl border rounded-full w-[20%] h-[20%] self-center cursor-pointer hover:bg-gray-100 transition-all">Get Started</button>
      </div>
    </div>
  )
}