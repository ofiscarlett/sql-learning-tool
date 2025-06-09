import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/hNf/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';

function App() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ExamPage" element={<ExamPage />} />
      {/* Add more routes as needed */}
    </Routes>
     

    </div>
  );
}

export default App;
