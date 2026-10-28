export default function ResultCard({ r, onDelete }) {
  return (
    <div className="card">
      <div className="head">
        <div>
          <b>{r.studentName}</b> {r.rollNo && <span>(Roll {r.rollNo})</span>}
        </div>
        <span className={r.status === "PASS" ? "pass" : "fail"}>{r.status}</span>
      </div>
      <p style={{ margin: "8px 0" }}>
        Total: <b>{r.total}/{r.maxTotal}</b> &nbsp; Percentage: <b>{r.percentage}%</b> &nbsp; Grade: <b>{r.grade}</b>
      </p>
      <table>
        <thead>
          <tr><th>Subject</th><th>Marks</th><th>Out of</th></tr>
        </thead>
        <tbody>
          {r.subjects.map((s) => (
            <tr key={s._id}><td>{s.name}</td><td>{s.marks}</td><td>{s.outOf}</td></tr>
          ))}
        </tbody>
      </table>
      <button className="ghost" style={{ marginTop: 10 }} onClick={() => onDelete(r._id)}>Delete</button>
    </div>
  );
}