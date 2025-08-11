// HomePage.tsx
"use client";
import Header from '../components/hNf/Header';
import React, { use, useEffect, useState } from 'react';
import erImage from '../images/ERDiagram.png'; // Assuming you have an ER diagram image
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/languageContext';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
type QuestionType = 'mcq' | 'multi';

interface Question {
  id: number;
  question_text: string;
  question_type: 'mcq' | 'multi';
  options: string[];
  correct_option_index?: number;         // for mcq
  correct_option_indexes?: number[];     // for multi
}
interface AnswerReview {
  question: Question;
  studentAns: number | number[];
  isCorrect: boolean;
}

export default function ExamPage() {
  //const [question, setQuestion] =  useState<{ id: number; question_text: string } | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  //const [studentAns, setStudentAns] = useState("");
  const [studentAns, setStudentAns] = useState<number | number[]>(-1);
  const [result, setResult] = useState<string | null>(null);
  const [showER, setShowER] = useState(false);
  const studentId = localStorage.getItem('studentId');
  const [scoreCount, setScoreCount] = useState(0);
  const [questionLimit, setQuestionLimit] = useState(0);
  const [answerReview, setAnswerReview] = useState<AnswerReview[]>([]);
  const [examFinished, setExamFinished] = useState(false);
  const [submittedScore, setsubmittedScore] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string | null>(null);
  const [clickForNext, setClickForNext] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [answeredQuestion, setAnsweredQuestion] = useState<number[]>([]);
  const navigate = useNavigate();
  const langContext = useContext(LanguageContext);
  const { multiLang, ChangeLanguage } = (langContext || { multiLang: 'FI', ChangeLanguage: () => {} }) as {
      multiLang: 'EN' | 'FI';
      ChangeLanguage: (lang: 'EN' | 'FI') => void;
    };
  const maxQuestions = 10; // Set a limit for the number of questions 
  console.log("question amount", questionLimit);
    const text = {
    EN: {
      startQuizAgain: 'Do Quiz Again',
      backToHomePage: 'Home',
      submit: "Submit", 
      nextQuestion: "Next Question",
      yourScores: "Your Scores",
      questionReview: "Question Review",
      examFinished: "Exam Finished 🎉",
    },
    FI: {
      startQuizAgain: 'Aloita testi uudelleen',
      backToHomePage: 'Etusivulle',
      submit: "Lähetä",
      nextQuestion: "Seuraava kysymys",
      yourScores: "Pisteesi",
      questionReview: "Kysymysten tarkastelu",
      examFinished: "Tentti suoritettu 🎉",
    },
  };
  const resetExamState = () => {
    setQuestion(null);
    setStudentAns(-1);
    setResult(null);
    setScoreCount(0);
    setQuestionLimit(0);
    setAnswerReview([]);
    setExamFinished(false);
    setAnsweredQuestion([]);
    };
  const fetchQuestion = async () => {
    const res = await fetch('/api/questions/random', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excludeIds: answeredQuestion })
    });
    const data = await res.json();
    setQuestion(data);
    setCorrectAnswerText(null);
     if (data.question_type === 'mcq') {
      setStudentAns(-1); // set as -1 for single choice
     } else if (data.question_type === 'multi') {
        setStudentAns([]); // set as empty array for multi-select
      }
      setResult(null); // Reset result
      setAnsweredQuestion((prev) => [...prev, data.id]); // Add to answered questions

  }

  const handleSubmit = async () => {
      if (!question || studentAns === -1|| studentAns === null) {
        alert('Missing answer');
        return;
        }
        if(!studentId) {
        return alert('Please login before submitting answers.');
        return;
        }
  
    const res = await fetch('/api/questions/check-ans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        questionId: question?.id, 
        studentAns, 
        studentId
      })
    });

    const data = await res.json();
    const isCorrect = data.result;
    setResult(data.result ? "Correct!" : "Incorrect.");
    setClickForNext(true); 
    if (!isCorrect ) {
      if (question.question_type === 'mcq') {
        setCorrectAnswerText(`Correct Answer: ${question.options[question.correct_option_index!]}`);
      } else if (question.question_type === 'multi') {
        const correctText=question.correct_option_indexes?.map(i => question.options[i]).join(', ');
        setCorrectAnswerText(`Correct Answers: ${correctText}`);
      }else {
        setCorrectAnswerText(null);
      }
    }
    /*
    if (isCorrect) {
      setScoreCount((prev) => prev + 1);
    }
      */
    if (typeof data.score === 'number') {
      setScoreCount((prev) => prev + data.score / 100);
    }
 
    setAnswerReview((prev) => [...prev,
      { question, studentAns, isCorrect } ]);
    //setQuestionLimit((prev) => prev + 1); // Increment question count
    //if (questionLimit + 1 >= maxQuestions) {
    //  setExamFinished(true);
    //} 
    //setQuestionLimit((prev) => {
    //  const next = prev + 1;
    //  if (next >= maxQuestions) {
    //    setExamFinished(true);
    //  }
    //  return next;
    //});
    setClickForNext(true);  
  };
    //setStudentAns(""); // Reset answer after submission  
  useEffect(() => {
    if (!examFinished && isFirstLoad) {
      fetchQuestion();
      setIsFirstLoad(false);
    }
    if (examFinished && !submittedScore
      && scoreCount + (maxQuestions - questionLimit) <= maxQuestions
    ) {
    const weightedScore = parseFloat(((scoreCount / maxQuestions) * 100).toFixed(2));
    console.log("Weighted Score:", weightedScore);
    alert(`Exam finished! Your score is ${weightedScore}%.`);
    
        fetch('/api/score/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            score: weightedScore,
          }),
        })
        .then(res => res.json())
        .then(data =>
          {
            console.log('Score saved:', data);
            setsubmittedScore(true); //prevent multiple submissions
          })
        .catch(err => console.error('Failed to save score:', err));
      }
      }, [examFinished,scoreCount, submittedScore, studentId, maxQuestions, isFirstLoad]);
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

       {examFinished ? (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">{text[multiLang].examFinished}</h2>
            <p className="mb-2">{text[multiLang].yourScores} ：{scoreCount} / {maxQuestions}</p>
            <h3 className="text-lg font-semibold mb-2">
             {text[multiLang].questionReview} ：</h3>
            {answerReview.map((item, index) => (
              <div key={index} className="mb-4 border-b pb-2">
                <p className="font-semibold">Q{index + 1}: {item.question.question_text}</p>
             <ul className="ml-4 list-disc">
            {item.question.options.map((opt, idx) => {
              const isCorrect = (item.question.question_type === 'mcq' && idx === item.question.correct_option_index) ||
                                (item.question.question_type === 'multi' && item.question.correct_option_indexes?.includes(idx));
              const isStudentChoice = Array.isArray(item.studentAns)
                ? item.studentAns.includes(idx)
                : item.studentAns === idx;

              return (
                <li
                  key={idx}
                  className={`
                    ${isCorrect ? 'text-green-600 font-semibold' : ''}
                    ${isStudentChoice ? 'bg-yellow-100 rounded px-1' : ''}
                  `}
                >
                  {opt}
                  {isCorrect && ' ✅'}
                  {isStudentChoice && !isCorrect && ' (Your answer)'}
                </li>
              );
            })}
          </ul>
                <p className="mt-1">
                  Your Answer:{" "}
                  {Array.isArray(item.studentAns)
                    ? item.studentAns.map(i => item.question.options[i]).join(', ')
                    : item.question.options[item.studentAns]}
                </p>
                <p className={item.isCorrect ? "text-green-600" : "text-red-600"}>
                  {item.isCorrect ? "✅ correct" : "❌ incorrect"}
                </p>
                {!item.isCorrect && (
                  <p className="text-red-600">
                    Correct Answer:{" "}
                    {item.question.question_type === 'mcq'
                      ? item.question.options[item.question.correct_option_index!]
                      : item.question.correct_option_indexes?.map(i => item.question.options[i]).join(', ')}  
                  </p>
                )}

              </div>
            ))}
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() =>  {
                    resetExamState();
                    fetchQuestion();
                  }}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                {text[multiLang].startQuizAgain}
              </button>
                      <button
                onClick={() => 
                  {
                  resetExamState();
                  navigate('/')}}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                {text[multiLang].backToHomePage}
              </button>
            </div>

          </div>
        ) :
question ? (
  
  <div className="bg-white p-4 rounded shadow">
        <p className="mb-2 text-sm text-gray-600">
          Question {questionLimit + 1} of {maxQuestions}
        </p>
    <p className="font-semibold mb-2">Question:</p>

    <p className="mb-4">{question.question_text}</p>

    {/* sinle choose */}
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

    {/* Multi choice */}
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
        {text[multiLang].submit}
      </button>
      <button
        onClick={() => {
          if(!clickForNext) return;
          setResult(null);                       // Reset result
          setCorrectAnswerText(null);           // reset correct answer text
          setClickForNext(false);
          //setQuestionLimit((prev) => prev + 1);  // Count next question
          setQuestionLimit((prev) => {
            const next = prev + 1;
            if (next >= maxQuestions) {
              setExamFinished(true);
            } else {
              fetchQuestion();
            }
            return next;
          });                   // change to next

        }}
        className="bg-gray-600 text-white px-4 py-2 rounded"
      >
        {text[multiLang].nextQuestion}
      </button>
      <button
          onClick={() => setShowER(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Show ER Diagram
        </button>
          {correctAnswerText && (
            <p className="text-red-600">
              {correctAnswerText}
            </p>  
         )}
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