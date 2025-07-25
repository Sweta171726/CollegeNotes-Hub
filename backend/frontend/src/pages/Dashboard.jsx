import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState(user?.branch || "");
  const [type, setType] = useState("");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const years = ["1st", "2nd", "3rd", "4th"];
  const branches = ["CSE", "IT", "ECE", "EE", "CE", "ME", "MIN", "META", "BIOMED", "BIOTECH"];
  const semesterMap = {
    "1st": ["1", "2"],
    "2nd": ["3", "4"],
    "3rd": ["5", "6"],
    "4th": ["7", "8"]
  };

  const fetchNotes = useCallback(async () => {
    console.log("📡 Sending GET request to /api/notes/all"); // Add this line
  
    try {
      const res = await axios.get("http://localhost:5001/api/notes/all");
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch notes:", err);
    }
  }, []);
  

  const handleUpload = async () => {
    if (!file || !title || !semester || !year || !branch || !type) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("semester", semester.trim());
    formData.append("year", year.trim().toLowerCase());
    formData.append("branch", branch.trim().toUpperCase());
    formData.append("type", type);

    try {
      await axios.post("http://localhost:5001/api/notes/upload", formData, {
        headers: { Authorization: token },
      });
      alert("✅ Uploaded successfully");
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Upload failed");
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.year?.toLowerCase().trim() === selectedYear.toLowerCase().trim() &&
    note.branch?.toUpperCase().trim() === selectedBranch.toUpperCase().trim() &&
    note.semester?.toString().trim() === selectedSemester.trim()
  );
  
  
  

  if (!user) return <p>Loading...</p>; // fallback for rare cases

  return (
    <div className="dashboard-container">
      <h2 className="welcome">👋 Welcome, {user?.rollNumber || "User"}</h2>

      {user?.isAdmin && (
        <div className="upload-box">
          <h3>📤 Admin Upload Section</h3>
          <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Semester (e.g. 4)" onChange={(e) => setSemester(e.target.value)} />
          <select onChange={(e) => setYear(e.target.value)} defaultValue="">
            <option value="" disabled>Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select onChange={(e) => setBranch(e.target.value)} defaultValue={branch}>
            <option value="" disabled>Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) => setType(e.target.value)} defaultValue="">
            <option value="" disabled>Select Type</option>
            <option value="Notes">Notes</option>
            <option value="PYQ">PYQ</option>
          </select>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}

      <h3 className="section-title">📚 Click to Explore Notes</h3>

      <div className="year-container">
        {years.map((year) => (
          <button
            key={year}
            className={year-btn ${selectedYear === year ? "active" : ""}
            onClick={() => {
              setSelectedYear(year);
              setSelectedBranch("");
              setSelectedSemester("");
            }}
          >
            {year} Year
          </button>
        ))}
      </div>

      {selectedYear && (
        <div className="branch-container">
          {branches.map((branch) => (
            <button
              key={branch}
              className={branch-btn ${selectedBranch === branch ? "active" : ""}}
              onClick={() => {
                setSelectedBranch(branch);
                setSelectedSemester("");
              }}
            >
              {branch}
            </button>
          ))}
        </div>
      )}

      {selectedBranch && (
        <div className="semester-container">
          {semesterMap[selectedYear]?.map((sem) => (
            <button
              key={sem}
              className={sem-btn ${selectedSemester === sem ? "active" : ""}}
              onClick={() => setSelectedSemester(sem)}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      )}

      {selectedSemester && (
        <div className="notes-list">
          <h4>📝 Notes for {selectedBranch} - Semester {selectedSemester}</h4>
          {filteredNotes.length === 0 ? (
            <p>No notes uploaded yet.</p>
          ) : (
            <ul>
              {filteredNotes.map((note) => (
                <li key={note._id}>
                  <strong>{note.title}</strong> ({note.type}) —{" "}
                  <a
                    href={http://localhost:5001/${note.fileUrl}}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📥 Download PDF
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;



