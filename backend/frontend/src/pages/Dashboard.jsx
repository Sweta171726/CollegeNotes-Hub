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

  // Fetch notes from backend
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get("/api/notes/all");
      console.log("📄 Notes fetched:", res.data);
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
    console.log("👤 Logged in user:", user);
    fetchNotes();
  }, [token, navigate, fetchNotes]);

  // Upload handler (admin only)
  const handleUpload = async () => {
    if (!file || !title || !semester || !year || !branch || !type) {
      alert("⚠️ Please fill all fields");
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
      console.error("Upload error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 Welcome, {user?.rollNumber || "User"}</h2>

      {/* Admin Upload Form */}
      {isAdmin && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📤 Upload Notes (Admin Only)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
            <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
            <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
            <select onChange={(e) => setType(e.target.value)} value={type}>
              <option value="notes">Notes</option>
              <option value="pyq">PYQ</option>
            </select>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div style={{ marginTop: "2rem" }}>
        <h3>📝 All Notes</h3>
        {notes.length === 0 ? (
          <p>No notes available yet.</p>
        ) : (
          notes.map((note) => {
            const fileUrl = note.fileUrl.startsWith("http") ? note.fileUrl : `/uploads/${note.fileUrl}`;
            return (
              <div key={note._id} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "1rem" }}>
                <h4>{note.title}</h4>
                <p>
                  Branch: {note.branch} | Sem: {note.semester} | Year: {note.year} | Type: {note.type}
                </p>
                <a href={fileUrl} target="_blank" rel="noreferrer">📥 Download PDF</a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Dashboard;



