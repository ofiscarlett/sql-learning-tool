import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LanguageContext } from '../../context/languageContext';

export default function LoginForm() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
    const langContext = useContext(LanguageContext);
    const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as {
      multiLang: 'EN' | 'FI';
      ChangeLanguage: (lang: 'EN' | 'FI') => void;
    };
    console.log("🔁 current multiLang:", multiLang);
  
    const text = {
      EN: {
        password: 'Password',
        startQuiz: 'Start Quiz',
        pleaseLogin: 'Please log in to begin.',
      },
      FI: {
        password: 'Salasana',
        startQuiz: 'Aloita tentti',
        pleaseLogin: 'Kirjaudu sisään aloittaaksesi.',
      },
    };
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password }),
      });
      const result = await response.json();
      
      if (response.ok) {
        const student = result.student;
       // save studentId to localStorage
        localStorage.setItem('studentId', student.student_id);
        login(result.student.student_id, result.student.name);
        //console.log('✅ Login success!');
        alert('Login successful');
        navigate('/');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-24">
      <h2 className="text-xl font-bold mb-4">Student Login</h2>
      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="w-full p-2 border mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
