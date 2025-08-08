
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ScoreItem {
  name: string;
  score: number;
  created_at: string;
}

export default function StudentAllScore() {
  const { studentId } = useParams();
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/score/history/${studentId}`)
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error("Failed to fetch score history:", err));
  }, [studentId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📘 Student Full Score History</h1>
      <button
        onClick={() => navigate("/admin/student-scores")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to List
      </button>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Score</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.score}</td>
              <td className="border px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
