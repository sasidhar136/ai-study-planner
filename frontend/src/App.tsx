import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
          AI Study Planner
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Your intelligent companion for perfectly scheduled study sessions.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
