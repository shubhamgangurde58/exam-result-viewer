import { useState } from "react";
import axios from "axios";

const blank = () => [
  { name: "Maths", marks: "", outOf: 100 },
  { name: "Science", marks: "", outOf: 100 },
  { name: "English", marks: "", outOf: 100 },
];

export default function ResultForm({ onSaved }) {
  const [studentName, setName] = useState("");
  const [rollNo, setRoll] = useState("");
  const [subjects, setSubjects] = useState(blank());
  const [error, setError] = useState("");

  const change = (i, field, value) =>
    setSubjects(subjects.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const submit = async () => {
    setError("");
    if (!studentName.trim()) return setError("Enter student name");
    if (subjects.some((s) => !s.name.trim() || s.marks === "" || s.outOf === ""))
      return setError("Fill all subject fields");

    const clean = subjects.map((s) => ({
      name: s.name.trim(),
      marks: Number(s.marks),
      outOf: Number(s.outOf),
    }));
    if (clean.some((s) => isNaN(s.marks) || isNaN(s.outOf) || s.outOf <= 0))
      return setError("Enter valid numbers");

    try {
      const { data } = await axios.post("http://localhost:5000/api/results", {
        studentName, rollNo, subjects: clean,
      });
      onSaved(data);
      setName(""); setRoll(""); setSubjects(blank());
    } catch (e) {
      setError(e.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Enter Marks</h3>
      <div className="top">
        <input placeholder="Student name" value={studentName} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Roll no" value={rollNo} onChange={(e) => setRoll(e.target.value)} />
      </div>
      {subjects.map((s, i) => (
        <div className="row" key={i}>
          <input placeholder="Subject" value={s.name} onChange={(e) => change(i, "name", e.target.value)} />
          <input type="number" placeholder="Marks" value={s.marks} onChange={(e) => change(i, "marks", e.target.value)} />
          <input type="number" placeholder="Out of" value={s.outOf} onChange={(e) => change(i, "outOf", e.target.value)} />
          <button className="ghost" onClick={() => setSubjects(subjects.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button className="ghost" onClick={() => setSubjects([...subjects, { name: "", marks: "", outOf: 100 }])}>
        + Subject
      </button>
      <button onClick={submit}>Calculate &amp; Save</button>
      {error && <div className="err">{error}</div>}
    </div>
  );
}