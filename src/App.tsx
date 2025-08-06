import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/hNf/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import MyExamPage from './pages/MyExamPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateQuestions from './pages/CreateQuestions';

function App() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ExamPage" element={<ExamPage />} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/my-exam" element={<MyExamPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/CreateQuestions" element={<CreateQuestions/>} />
      {/* Add more routes as needed */}
    </Routes>
     

    </div>
  );
}

export default App;
