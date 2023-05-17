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
    <div class="body-class">

      <header class="header-dash">
        <div class="logo">
          <a href="#">PokeGo</a>
        </div>
      </header>
      <div class="container-dash">
        <nav>
          <div class="side_navbar">
            <span>Main Menu</span>
            <a href="#" class="active">Dashboard</a>
            <a href="#">Edit Profile</a>
            <button href="#" onClick={() => onLogout()}>Logout</button>
          </div>
        </nav>

        <div class="main-body">
          <h2 className="dashboard-text">Dashboard</h2>
          <div class="promo_card">
            <h1 className="welcome-text">Welcome to PokeGo</h1>
            <span>Welcome digital warrior, fight your own battle in 1080p.</span>
          </div>

          <div class="history_lists">
            <div class="list1">
              <div class="row">
                <h4 className="user-datails">User Details</h4>
              </div>
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
             
            </div>
            </div>

            <div class="list2">
              <div class="row">
                <h4>Streaks</h4>
              </div>
              <table className="dash-table">
                <thead>
                  <th>Maximum Streak </th>
                  <th>Current Streak </th>
                </thead>
                <tr>
                  <td>{user && <h1 className="streak-item">{user.logedCount}</h1> }</td>
                  <td> {user && <h1 className="streak-item">{user.logedCountPerDay}</h1>}</td> 
                </tr>

              </table>
            </div>
          </div>
        </div>

        <div class="sidebar">

        </div>

      </div>
    </div>
  )
}
