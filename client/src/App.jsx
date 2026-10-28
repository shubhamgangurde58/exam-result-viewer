import { useEffect, useState } from "react";
import axios from "axios";
import ResultForm from "./ResultForm";
import ResultCard from "./ResultCard";

const API = "http://localhost:5000/api/results";

export default function App() {
  const [results, setResults] = useState([]);

  const load = async () => setResults((await axios.get(API)).data);
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await axios.delete(`${API}/${id}`);
    load();
  };

  return (
    <div className="wrap">
      <h1>Exam Result Viewer</h1>
      <ResultForm onSaved={load} />
      <h3>Saved Results</h3>
      {results.length === 0 && <p>No results yet.</p>}
      {results.map((r) => (
        <ResultCard key={r._id} r={r} onDelete={remove} />
      ))}
    </div>
  );
}