import React, { useContext, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/languageContext';

export default function CreateQuestions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const langContext = useContext(LanguageContext);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'mcq' | 'multi'>('mcq');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);              // for mcq
  const [correctIndexes, setCorrectIndexes] = useState<number[]>([]); // for multi
  const [message, setMessage] = useState('');
  const teacherToken = localStorage.getItem('teacherToken');
  const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as {
    multiLang: 'EN' | 'FI';
    ChangeLanguage: (lang: 'EN' | 'FI') => void;
  };
  console.log("current multiLang:", multiLang);

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
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    const payload = {
      question_text: questionText,
      question_type: questionType,
      options,
      correct_option_index: questionType === 'mcq' ? correctIndex : undefined,
      correct_option_indexes: questionType === 'multi' ? correctIndexes : undefined
    };

    try {
      const res = await fetch('/api/questions/createQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`  // check if it is teacher
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Question created successfully');
        alert('Question created successfully');
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectIndex(0);
        setCorrectIndexes([]);
        setQuestionType('mcq');
         setTimeout(() => setMessage(''), 5000); 
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(' Failed to create question');
    }
  };

  return (
    <div className="border p-3 w-[800px] resize-none">
    <div className="w-full max-w-5xl mx-auto bg-white p-8 pt-16 rounded shadow" >
      <h1 className="text-3xl font-bold mb-4 text-center">Create Questions</h1>
      <label className="block mb-2">
        Question:
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} 
        className="w-full border p-2" 
        rows={5}
        />
      </label>

      <label className="block mb-2">
        Type:
        <select value={questionType} onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'multi')} className="w-full border p-2">
          <option value="mcq">Single Choice</option>
          <option value="multi">Multiple Choice</option>
        </select>
      </label>

      <div className="mb-4">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-1">
      <textarea
        value={opt}
        onChange={(e) => handleOptionChange(idx, e.target.value)}
        className="border p-2 w-full resize-none"
        rows={2}
        placeholder={`Option ${idx + 1}`}
      />
            <p className="mb-2 text-sm text-gray-600 italic">Select the correct answer:</p>
            {questionType === 'mcq' ? (
              <input
                type="radio"
                name="correct"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
                className="ml-2"
              />
            ) : (
              <input
                type="checkbox"
                checked={correctIndexes.includes(idx)}
                onChange={() => {
                  setCorrectIndexes((prev) =>
                    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                  );
                }}
                className="ml-2"
              />
            )}
          </div>
        ))}
      </div>
        <div className="text-center">
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded text-center">
        Create New Question
      </button>
        </div>


      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
        </div>
  );
}