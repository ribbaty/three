
import React, { useState } from 'react';
import Game from './components/Game';
import { Info } from 'lucide-react';
import { BACKGROUND_IMAGE_URL } from './constants';

// Custom Cute Bow Icon (Empty/Outline)
const CuteBowIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 14c1.5-1 2.5-3 2.5-5 0-2.5-2-3.5-3.5-2.5C10 7.5 12 9 12 9s2-1.5 1-2.5C11.5 5 9.5 6 9.5 8.5c0 2 1 4 2.5 5z" />
    <path d="M12 14c-1.5-1-2.5-3-2.5-5" />
    <path d="M12 9c.5 2 2.5 4 4 4.5 1.5.5 3-1 3-2.5 0-1.5-1-2-2-2-1 0-3.5 1.5-5 0" />
    <path d="M12 9c-.5 2-2.5 4-4 4.5-1.5.5-3-1-3-2.5 0-1.5 1-2 2-2 1 0 3.5 1.5 5 0" />
    <path d="M12 14v4" />
    <path d="M12 18l-3 3" />
    <path d="M12 18l3 3" />
  </svg>
);

export default function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
      const saved = localStorage.getItem('watermelon-best-score');
      return saved ? parseInt(saved, 10) : 0;
  });

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('watermelon-best-score', newScore.toString());
    }
  };

  const handleGameOver = (finalScore: number) => {
      if (finalScore > bestScore) {
          setBestScore(finalScore);
          localStorage.setItem('watermelon-best-score', finalScore.toString());
      }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-['Fredoka'] selection:bg-pink-200"
      style={{
        backgroundImage: `url("${BACKGROUND_IMAGE_URL}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#FFF8E1' // Fallback
      }}
    >
      {/* Header */}
      <header className="w-full max-w-md mx-auto p-4 pt-8 flex flex-col items-center gap-6">
        {/* Title */}
        <div className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-5xl font-black text-[#FF6B6B] tracking-wide drop-shadow-[3px_3px_0px_rgba(255,255,255,1)] flex items-center gap-1">
              DuoDuo
              <span className="text-[#4ECDC4] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Merge</span>
            </h1>
        </div>
        
        {/* Score Board */}
        <div className="flex gap-4 w-full justify-center px-2">
            {/* Best Score */}
            <div className="flex-1 bg-white/80 backdrop-blur-md px-4 py-3 rounded-3xl shadow-[0_4px_0_#FBCFE8] border-2 border-pink-200 flex flex-col items-center transform hover:-translate-y-1 transition-transform">
                <span className="text-xs text-pink-400 font-extrabold uppercase tracking-widest flex items-center gap-1 mb-1">
                    Best <CuteBowIcon className="w-4 h-4 stroke-pink-400" />
                </span>
                <span className="text-2xl font-black text-slate-700 leading-none">
                    {bestScore}
                </span>
            </div>

             {/* Current Score */}
             <div className="flex-1 bg-[#A7F3D0]/90 backdrop-blur-md px-4 py-3 rounded-3xl shadow-[0_4px_0_#34D399] border-2 border-white flex flex-col items-center transform hover:-translate-y-1 transition-transform">
                <span className="text-xs text-[#065F46] font-extrabold uppercase tracking-widest flex items-center gap-1 mb-1">
                    Score <CuteBowIcon className="w-4 h-4 stroke-[#065F46]" />
                </span>
                <span className="text-3xl font-black text-[#064E3B] leading-none">
                    {score}
                </span>
            </div>
        </div>
      </header>

      {/* Game Container */}
      <main className="flex-1 flex flex-col items-center justify-start pb-4 overflow-hidden px-4 w-full">
        <Game 
            onScoreUpdate={handleScoreUpdate} 
            onGameOver={handleGameOver}
        />
      </main>
      
      {/* Instructions / Footer */}
      <footer className="w-full max-w-md mx-auto p-4 text-center pb-8">
          <div className="inline-flex items-center gap-2 text-[#F472B6] text-sm bg-white/60 px-6 py-3 rounded-full border-2 border-pink-100 shadow-sm backdrop-blur-sm font-bold hover:bg-white/80 transition-colors">
            <Info size={18} strokeWidth={2.5} />
            <span>Drop & Merge the cute items!</span>
          </div>
      </footer>
    </div>
  );
}
