import React from 'react';

export default function ExamCard() {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo and review*/}
      <div className="flex items-center space-x-6">
        <span className="text-xl font-bold text-gray-800">Moodle</span>
        <nav className="flex space-x-4 text-sm text-gray-600">
          <a href="#" className="hover:text-black">Dashboard</a>
          <a href="#" className="hover:text-black">My courses</a>
        </nav>
      </div>

      {/* right:search、notice 、user */}
      <div className="flex items-center space-x-4 text-gray-600 text-lg">
        <span title="Search">🔍</span>
        <span title="Notifications">🔔</span>
        <span title="Messages">💬</span>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
          Exam Card 
        </div>
      </div>
    </header>
  );
}
