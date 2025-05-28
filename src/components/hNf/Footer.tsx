import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* 左側：Logo + 導覽 */}
      <div className="flex items-center space-x-6">
        <span className="text-xl font-bold text-gray-800">I am Footer</span>
        <nav className="flex space-x-4 text-sm text-gray-600">
          <a href="#" className="hover:text-black">I am footer</a>
        </nav>
      </div>

 
    
    </footer>
  );
}
