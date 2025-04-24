import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Account = () => {
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    navigate("/login")
    window.location.reload()
  }

  return(
    <>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Account