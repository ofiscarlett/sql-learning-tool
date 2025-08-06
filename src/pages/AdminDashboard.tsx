// src/pages/AdminDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => navigate('/admin/create-student')}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700"
        >
          Add Student
        </button>

        <button
          onClick={() => navigate('/CreateQuestions')}
          className="w-full bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700"
        >
          Create Question
        </button>

        <button
          onClick={() => navigate('/admin/student-scores')}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded hover:bg-purple-700"
        >
          View Student Scores
        </button>
      </div>
    </div>
  );
}
