import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      // 儲存使用者名稱（可改成用 Context/Firebase 等方式）
      localStorage.setItem('username', name);
      navigate('/home');
    } else {
      alert('Please enter your name');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/5f/OAMK_logo.svg"
        alt="OAMK Logo"
        className="w-40 mb-6"
      />
      <h2 className="text-lg font-medium text-gray-700">Database Exercise</h2>
      <p className="max-w-md text-sm text-gray-600 mt-2">
        You are here to do database exercise. Total exam time is 60 minutes.
        You cannot go back to check answers. It includes multiple choice, single choice or fill-in.
        You will get your result at the end of the exam.
      </p>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-6 px-4 py-2 border rounded shadow-sm focus:outline-none"
      />

      <button
        onClick={handleLogin}
        className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
      >
        Start
      </button>

      <p className="mt-2 text-xs text-gray-500">Click button to start.</p>
    </div>
  );
}
