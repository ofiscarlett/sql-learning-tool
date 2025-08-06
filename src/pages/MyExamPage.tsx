import React,  { useContext, useState, useEffect } from "react";
import { LanguageContext } from '../context/languageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ScoreHistoryItem {
  name: string;
  score: number;
  created_at: string;
}


export default function MyExamPage() {
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);
  const studentId = localStorage.getItem('studentId'); // get id from localStorage
    const navigate = useNavigate();
    const langContext = useContext(LanguageContext);
    const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as {
        multiLang: 'EN' | 'FI';
        ChangeLanguage: (lang: 'EN' | 'FI') => void;
      };

    const text = {
    EN: {
      name: 'Student Name',
      score: 'Score',
      examDate: 'Date',
      questionReview: "Question Review",
      examFinished: "Exam Finished 🎉",
    },
    FI: {
        name: 'Opiskelijan nimi',
        score: 'Pisteet',
        examDate: 'Päivämäärä',
        questionReview: "Kysymysten tarkastelu",
        examFinished: "Tentti suoritettu 🎉",
    },
  };
  useEffect(() => {
    if (!studentId) return;

    fetch(`/api/score/history/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      })
      .catch((err) => {
        console.error('Failed to fetch score history:', err);
      });
  }, [studentId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📜 My Exam History</h1>
      {history.length === 0 ? (
        <p>No exam history yet.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
                <th className="px-4 py-3 border">{text[multiLang].name}</th>
                <th className="px-4 py-3 border">{text[multiLang].score}</th>
                <th className="px-4 py-3 border">{text[multiLang].examDate}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx} 
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border px-4 py-2 boarder">{item.name}</td>
                <td className="border px-4 py-2 boarder">{item.score}</td>
                <td className="border px-4 py-2 boarder">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
