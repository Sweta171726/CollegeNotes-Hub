import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [type, setType] = useState("notes");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin;

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get("/api/notes/all");
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch notes:", err);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [token, navigate, fetchNotes]);

  const handleUpload = async () => {
    if (!file || !title || !semester || !year || !branch || !type) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("semester", semester);
    formData.append("year", year);
    formData.append("branch", branch);
    formData.append("type", type);

    try {
      await axios.post("/api/notes/upload", formData, {
        headers: { Authorization: token },
      });
      alert("✅ Uploaded successfully!");
      fetchNotes();
    } catch (err) {
      alert("❌ Upload failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 Welcome, {user.rollNumber}</h2>

      {isAdmin && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📤 Upload Notes (Admin Only)</h3>
          <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Semester" onChange={(e) => setSemester(e.target.value)} />
          <input placeholder="Year" onChange={(e) => setYear(e.target.value)} />
          <input placeholder="Branch" onChange={(e) => setBranch(e.target.value)} />
          <select onChange={(e) => setType(e.target.value)} value={type}>
            <option value="notes">Notes</option>
            <option value="pyq">PYQ</option>
          </select>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h3>📝 All Notes</h3>
        {notes.map((note) => (
          <div key={note._id} style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
            <h4>{note.title}</h4>
            <p>Branch: {note.branch} | Sem: {note.semester} | Year: {note.year} | Type: {note.type}</p>
            <a href={`/${note.fileUrl}`} target="_blank" rel="noreferrer">📥 Download PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;




