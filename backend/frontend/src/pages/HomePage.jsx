import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    rollNumber: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/signup";
      const res = await axios.post(url, formData);
      alert(res.data.msg || "Success!");
      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom right, #d0e9ff, #e0ffe3);
          font-family: "Segoe UI", sans-serif;
          padding: 20px;
        }
        .form-box {
          background: white;
          padding: 30px 40px;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .form-box h1 {
          font-size: 32px;
          color: #004aad;
          margin-bottom: 10px;
        }
        .form-box p {
          font-size: 16px;
          color: #555;
          margin-bottom: 25px;
        }
        .form-box h2 {
          font-size: 24px;
          margin-bottom: 15px;
          color: #222;
        }
        .form-box form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-box input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
        }
        .form-box button {
          background-color: #004aad;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .form-box button:hover {
          background-color: #003e8a;
        }
        .toggle-text {
          margin-top: 15px;
          font-size: 14px;
        }
        .link-btn {
          background: none;
          border: none;
          color: #004aad;
          cursor: pointer;
          font-weight: bold;
          margin-left: 5px;
        }
      `}</style>

      <div className="home-container">
        <div className="form-box">
          <h1>📚 CollegeNotes Hub</h1>
          <p>Your one-stop solution for notes 📒, PYQs 📘 & more!</p>

          <h2>{isLogin ? "🔐 Login" : "📝 Sign Up"}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="👤 Full Name"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="branch"
                  placeholder="🏫 Branch"
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <input
              type="text"
              name="rollNumber"
              placeholder="🆔 Roll Number"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="🔑 Password"
              onChange={handleChange}
              required
            />
            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <button className="link-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
