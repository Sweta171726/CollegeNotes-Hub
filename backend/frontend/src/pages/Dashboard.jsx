import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    axios.get("/api/notes").then((res) => {
      setNotes(res.data);

      const yearSet = new Set();
      const branchSet = new Set();
      const semSet = new Set();

      res.data.forEach((note) => {
        yearSet.add(note.year);
        branchSet.add(note.branch);
        semSet.add(note.semester);
      });

      setYears([...yearSet]);
      setBranches([...branchSet]);
      setSemesters([...semSet]);
    });
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      (!selectedYear || note.year === selectedYear) &&
      (!selectedBranch || note.branch === selectedBranch) &&
      (!selectedSemester || note.semester === selectedSemester)
  );

  return (
    <div className="dashboard">
      <h1>Notes Dashboard</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Year:</label>
          {years.map((year) => (
            <button
              key={year}
              className={`year-btn ${selectedYear === year ? "active" : ""}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <label>Branch:</label>
          {branches.map((branch) => (
            <button
              key={branch}
              className={`branch-btn ${selectedBranch === branch ? "active" : ""}`}
              onClick={() => setSelectedBranch(branch)}
            >
              {branch}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <label>Semester:</label>
          {semesters.map((sem) => (
            <button
              key={sem}
              className={`sem-btn ${selectedSemester === sem ? "active" : ""}`}
              onClick={() => setSelectedSemester(sem)}
            >
              {sem}
            </button>
          ))}
        </div>
      </div>

      <div className="notes-list">
        {filteredNotes.map((note) => (
          <div key={note._id} className="note-item">
            <h3>{note.title}</h3>
            <p>Year: {note.year}</p>
            <p>Branch: {note.branch}</p>
            <p>Semester: {note.semester}</p>
            <a
              href={`http://localhost:5001/${note.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;



