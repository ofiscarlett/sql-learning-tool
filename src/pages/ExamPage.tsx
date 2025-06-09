// HomePage.tsx
"use client";
import Header from '../components/hNf/Header';
import React, { use, useEffect, useState } from 'react';
import erImage from '../images/ERDiagram.png'; // Assuming you have an ER diagram image

export default function ExamPage() {
  const [question, setQuestion] =  useState<{ id: number; question_text: string } | null>(null);
  const [studentAns, setStudentAns] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [showER, setShowER] = useState(false);

  const fetchQuestion = async () => {
    const res = await fetch('/api/questions/random');
    const data = await res.json();
    setQuestion(data);
    setStudentAns(""); // Reset answer when new question is fetched
    setResult(null); // Reset result when new question is fetched 
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/questions/chekc-ans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question?.id, studentAns })

    });
    const data = await res.json();
    setResult(data.result ? "Correct!" : "Incorrect, try again.");
    //setStudentAns(""); // Reset answer after submission
  };
  useEffect(() => {
    fetchQuestion();
  }, []);
  //esc key to close ER diagram
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowER(false);
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
  return (
    <div className="min-h-screen bg-gray-100">
    
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Exam Page Here</h1>
 {question ? (
          <div className="bg-white p-4 rounded shadow">
            <p className="font-semibold mb-2">Question:</p>
            <p className="mb-4">{question.question_text}</p>

            <textarea
              value={studentAns}
              onChange={(e) => setStudentAns(e.target.value)}
              placeholder="Write your SQL here..."
              className="w-full h-40 border p-2 rounded mb-4 font-mono"
            />

            <div className="flex gap-2 mb-4">
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                Run
              </button>
              <button onClick={fetchQuestion} className="bg-gray-600 text-white px-4 py-2 rounded">
                Next Question
              </button>
              <button onClick={() => setShowER(true)} className="bg-green-600 text-white px-4 py-2 rounded">
                View ER Diagram
              </button>
            </div>

            {result && (
              <div className="bg-yellow-100 text-gray-800 p-3 rounded shadow">{result}</div>
            )}
          </div>
        ) : (
          <p>Loading question...</p>
        )}
      </main>
      {showER && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded shadow max-w-3xl w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">ER Diagram</h2>
        <button onClick={() => setShowER(false)} className="text-red-500 font-bold text-xl">&times;</button>
        %times;
      </div>
      <img src={erImage} alt="ER Diagram" className="w-full rounded" />
    </div>
  </div>
)}

    </div>
  );
}
