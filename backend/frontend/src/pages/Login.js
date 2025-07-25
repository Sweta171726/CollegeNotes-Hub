import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", {
        rollNumber,
        password,
      });

      // Save token and user data to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Optional: You can log or check if user is admin
      console.log("Logged in user:", res.data.user);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <input
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none" }}
      >
        Login
      </button>
      <p
        onClick={() => navigate("/signup")}
        style={{ marginTop: "10px", cursor: "pointer", color: "#007bff" }}
      >
        Don't have an account? Sign up
      </p>
    </div>
  );
}

export default Login;
