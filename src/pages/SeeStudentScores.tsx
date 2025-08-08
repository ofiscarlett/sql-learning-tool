import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TopScoreItem {
  student_id: string;
  name: string;
  scores: number[];
}

export default function SeeStudentScores() {
  const [topScores, setTopScores] = useState<TopScoreItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/score/top3-perStudent")
      .then((res) => res.json())
      .then((data) =>  {
        console.log("Top scores:", data);
        setTopScores(data)})
      .catch((err) => console.error("Failed to fetch top scores:", err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 All Students - Top 3 Scores</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Student ID#</th>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Top 3 Scores</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td
                className="border px-4 py-2 text-blue-600 underline cursor-pointer"
                onClick={() => navigate(`/admin/student-scores/${item.student_id}`)}
              >
                {item.student_id}
              </td>
              <td
                className="border px-4 py-2 text-blue-600 underline cursor-pointer"
                onClick={() => navigate(`/admin/student-scores/${item.student_id}`)}
              >
                {item.name}
              </td>
              <td className="border px-4 py-2">
                {item.scores.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}