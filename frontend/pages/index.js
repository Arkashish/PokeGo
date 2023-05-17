import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Home() {
  const [battleId, setBattleId] = useState("");
  const router = useRouter();

 const onLogout = () =>{

  localStorage.removeItem("auth");
  router.push('/login');

  toast.success(`😃 Logout successfully!`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
 }

 useEffect(() => {
  var user=localStorage.getItem("auth");
  if(user){
    router.push('/');
  }else{
    router.push('/login');
  }
}, []);
  
  return (
    <div className="bg-blue-100 h-screen">
      <nav>
        <div className="flex text-center space-x-16">
          <div className="w-3/4">
          </div>
          <div className="w-1/4">
            <ul className=" p-6 m-2">
              <li>
                <a className="m-2" href="/dashboard">User Profile  </a>
                <a className="m-2" href="https://pokegoshop.netlify.app/">PokeGoCart</a>
                <button className="m-2" onClick={()=>onLogout()}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <h1 className="text-center text-5xl p-16 font-bold">PokeBattle!</h1>

      <div className="flex text-center space-x-16">
        <div className="w-1/2">
          <a className="w-full p-6 m-2 bg-blue-300" href="/battle">New Game</a>
        </div>
        <div className="w-1/2">
          <input className="w-1/2 p-6" type="text" onChange={(e) => setBattleId(e.target.value)}></input>
          <a className="w-full p-6 m-2 bg-blue-300" href={"/battle?battleId=" + battleId}>Join Game</a>
        </div>

      </div>
      <footer footer style={{ position: "fixed", bottom: 0, width: "100%" }}>
        <div className="text-center">
          <p>&copy; 2023 PokeGo. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
