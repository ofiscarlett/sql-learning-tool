// HomePage.tsx
import React, { useContext } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/languageContext';


export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const langContext = useContext(LanguageContext);
  const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as {
    multiLang: 'EN' | 'FI';
    ChangeLanguage: (lang: 'EN' | 'FI') => void;
  };
  console.log("🔁 current multiLang:", multiLang);

  const text = {
    EN: {
      welcome: 'Welcome to the OAMK Quiz System',
      startQuiz: 'Start Quiz',
      pleaseLogin: 'Please log in to begin.',
    },
    FI: {
      welcome: 'Tervetuloa OAMK Tenttijärjestelmään',
      startQuiz: 'Aloita tentti',
      pleaseLogin: 'Kirjaudu sisään aloittaaksesi.',
    },
  };

  return (
    <div className="text-center mt-24">
      <h1 className="text-3xl font-bold mb-4">{text[multiLang].welcome}</h1>
      {user ? (
        <button
          onClick={() => navigate('/ExamPage')}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {text[multiLang].startQuiz}
        </button>
      ) : (
        <p className="text-gray-500">{text[multiLang].pleaseLogin}</p>
      )}
    </div>
  );
}