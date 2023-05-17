import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FaUserTie } from 'react-icons/fa'
import { toast } from "react-toastify";

export default function Dashboard() {

  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    var logedUser = localStorage.getItem("auth");
    if (logedUser) {
      setUser(JSON.parse(logedUser));
    }
  }, []);

  const onLogout = () => {

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

  return (
    <div class="main-body">
      <div className="wrapper">
        <h2 className="header-text">Dashboard</h2>
        <div class="promo_card">
          <h1 className="welcome-text">Welcome to Pokego</h1>
          <span>Dashboard portal</span>
        </div>

        <div class="history_lists">
          <div class="list1">
            <div className="user-profile-wrapper">
              <div className="user-wrapper">
                <FaUserTie className="user-icon" />
              </div>
              {
                user && <h2 className="user-name">#{user.username}</h2>
              }
              {
                user && <p className="user-email">{user.email}</p>
              }
              <button className="logout-btn" onClick={() => onLogout()}>Logout</button>
              <a className="home-btn" href="/" >Home Page</a>
            </div>
          </div>
          <div className="streak-wrapper">
            <div className="streak-item-wrapper" >
              {user && <h1 className="streak-item">Current streak : {" "}{user.logedCountPerDay}</h1>} 
            </div>
            <div className="streak-item-wrapper" >
              {user && <h1 className="streak-item">Max streak : {" "}{user.logedCount}</h1> }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
