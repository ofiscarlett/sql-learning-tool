import React, { useContext, useState} from 'react';
import headerImage from '../../images/school-logo-05.png'; 
import { LanguageContext } from '../../context/languageContext';

export default function Header() {
  const langContext = useContext(LanguageContext);
  const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as { multiLang: 'EN' | 'FI'; ChangeLanguage: (lang: 'EN' | 'FI') => void };
  console.log("🔁 current multiLang:", multiLang);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState('');

  const handleLogin = () => {
    // login API、OAuth 
    setIsLoggedIn(true);
    setStudentName('Alex Niemi');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentName('');
  };

  const text = {
    EN: {
      title: 'Moodle',
      dashboard: 'Dashboard',
      exam: 'My Exam',
    },
    FI: {
      title: 'Moodli',
      dashboard: 'Työpöytä',
      exam: 'Tenttini',
    },
    };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 z-10">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">

        {/* left：title + nav */}
        <div className="flex items-center space-x-6">
          <span className="text-xl font-bold text-gray-800">{text[multiLang].title}</span>
          <nav className="flex space-x-4 text-sm text-gray-600">
            <a href="#" className="hover:text-black">{text[multiLang].dashboard}</a>
            <a href="#" className="hover:text-black">{text[multiLang].exam}</a>
          </nav>
        </div>
          {/* middle */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {/* icons */}
          <span title="Search">🔍</span>
          <span title="Notifications">🔔</span>
          <span title="Messages">💬</span>

          {/* language  */}
          <div className="flex space-x-2 items-center">
            <button onClick={() => ChangeLanguage('EN')} className={multiLang === 'EN' ? 'font-bold text-black' : ''}>EN</button>
            <span>|</span>
            <button onClick={() => ChangeLanguage('FI')} className={multiLang === 'FI' ? 'font-bold text-black' : ''}>FI</button>
          </div>

          {/* login */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">{studentName}</span>
              <button onClick={handleLogout} className="text-blue-500 underline">Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="text-blue-500 underline">Login</button>
          )}
        </div>

    {/* right side */}
    <div className="flex items-center ml-4">
        <img
        src={headerImage}
        alt="School Logo"
        className="h-10 w-auto object-contain self-start"
      />
      </div>
 

        </div>
      
    </header>
  );
}
