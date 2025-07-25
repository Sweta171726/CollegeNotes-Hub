import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("/api/auth/signup", {
        rollNumber,
        branch,
        password,
        isAdmin: false,
      });
      alert("Signup successful. Login now.");
      navigate("/");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Roll Number" onChange={(e) => setRollNumber(e.target.value)} />
      <input placeholder="Branch" onChange={(e) => setBranch(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;
