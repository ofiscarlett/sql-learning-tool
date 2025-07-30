// HomePage.tsx
"use client";
import Header from '../components/hNf/Header';
import React, { use, useEffect, useState } from 'react';
import erImage from '../images/ERDiagram.png'; // Assuming you have an ER diagram image

type QuestionType = 'mcq' | 'multi';

interface Question {
  id: number;
  question_text: string;
  question_type: 'mcq' | 'multi';
  options: string[];
  correct_option_index?: number;         // for mcq
  correct_option_indexes?: number[];     // for multi
}

export default function ExamPage() {
  //const [question, setQuestion] =  useState<{ id: number; question_text: string } | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  //const [studentAns, setStudentAns] = useState("");
  const [studentAns, setStudentAns] = useState<number | number[]>(-1);
  const [result, setResult] = useState<string | null>(null);
  const [showER, setShowER] = useState(false);

  const fetchQuestion = async () => {
    const res = await fetch('/api/questions/random');
    const data = await res.json();
    setQuestion(data);
     if (data.question_type === 'mcq') {
      setStudentAns(-1); // set as -1 for single choice
     } else if (data.question_type === 'multi') {
        setStudentAns([]); // set as empty array for multi-select
      }

  setResult(null); // Reset result
    //setStudentAns(""); // Reset answer when new question is fetched
    //setResult(null); // Reset result when new question is fetched 
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/questions/check-ans', {
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

    {/* 單選題 */}
    {question.question_type === 'mcq' && question.options && (
      <div className="mb-4">
        {question.options.map((option: string, index: number) => (
          <label key={index} className="block">
            <input
              type="radio"
              name="mcq"
              value={index}
              checked={typeof studentAns === 'number' && studentAns === index}
              onChange={(e) => setStudentAns(Number(e.target.value))}
            />{" "}
            {option}
          </label>
        ))}
      </div>
    )}

    {/* 多選題 */}
    {question.question_type === 'multi' && question.options && (
      <div className="mb-4">
        {question.options.map((option: string, index: number) => (
          <label key={index} className="block">
            <input
              type="checkbox"
              value={index}
              checked={Array.isArray(studentAns) && studentAns.includes(index)}
              onChange={(e) => {
                const value = Number(e.target.value);
                setStudentAns((prev) => {
                   const checkedValues = prev as number[];
                   return e.target.checked
                   ? [...checkedValues, value]
                   : checkedValues.filter((v) => v !== value);
                } );
              }}
            />{" "}
            {option}
          </label>
        ))}
      </div>
    )}

    <div className="flex gap-2 mb-4">
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
      <button onClick={fetchQuestion} className="bg-gray-600 text-white px-4 py-2 rounded">
        Next Question
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
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setShowER(false)}
  >
    <div
      className="relative bg-white p-4 rounded shadow max-w-5xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setShowER(false)}
        className="absolute top-2 right-2 text-red-600 text-3xl font-bold hover:text-red-800"
        aria-label="Close"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-4">ER Diagram</h2>
      <img src={erImage} alt="ER Diagram" className="w-full rounded" />
    </div>
  </div>
)}


    </div>
  );
}
