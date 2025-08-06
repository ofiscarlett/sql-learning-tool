import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LanguageContext } from '../../context/languageContext';

export default function LoginForm() {
  //const [studentId, setStudentId] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
    const langContext = useContext(LanguageContext);
    const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as {
      multiLang: 'EN' | 'FI';
      ChangeLanguage: (lang: 'EN' | 'FI') => void;
    };
  
  
    const text = {
      EN: {
        login: 'Login',
        password: 'Password',
        startQuiz: 'Start Quiz',
        identifier: 'Student ID or Username',
        pleaseLogin: 'Please log in to begin.',
      },
      FI: {
        login: 'Kirjaudu sisään',
        password: 'Salasana',
        startQuiz: 'Aloita tentti',
        identifier: 'Opiskelijanumero tai Käyttäjänimi',
        pleaseLogin: 'Kirjaudu sisään aloittaaksesi.',
      },
    };
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        });
        console.log('PWD from frontend:', password);
      
      const result = await response.json();
      
      if (response.ok) {
        //const {role} = result;
        if(result.role === 'student') { 
        localStorage.setItem('studentId', result.student.student_id);
        login(result.student.student_id, result.student.name);
        //console.log('✅ Login success!');
        alert('Login successful');
        navigate('/');
        }else if (result.role === 'teacher') {
        localStorage.setItem('teacherToken', result.token);
        //login(result.teacher.username, result.teacher.username);
        login(result.teacher.username, result.role);

        alert('Logged in as teacher');
        navigate('/admin');
      }
    }else {
        alert(result.message || 'Login failed');
      }
    }
       catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-24">
      <h2 className="text-xl font-bold mb-4">{text[multiLang].login}</h2>
      <input
        type="text"
        placeholder="ID number or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="w-full p-2 border mb-3"
      />
      <input
        type="password"
        placeholder={text[multiLang].password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
          {text[multiLang].login}
      </button>
    </div>
  );
}
