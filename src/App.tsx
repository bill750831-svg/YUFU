/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ChevronRight, ChevronLeft, RotateCcw, Sparkles } from 'lucide-react';
import { ALL_LESSONS } from './constants';
import DrawingPad from './components/DrawingPad';

export default function App() {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentData = ALL_LESSONS[currentLesson];
  const currentItem = currentData[currentIndex];

  const speak = useCallback((text: string, rate: number = 0.8) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < currentData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLesson(parseInt(e.target.value));
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const resetLesson = () => {
    setCurrentIndex(0);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-serif text-stone-800 p-2 md:p-4 flex flex-col items-center">
      <header className="w-full max-w-3xl flex flex-row justify-between items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <select
            value={currentLesson}
            onChange={handleLessonChange}
            className="bg-white border-2 border-stone-200 rounded-lg px-3 py-1 text-base font-medium focus:outline-none focus:ring-2 focus:ring-olive-500 shadow-sm"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>第 {num} 課</option>
            ))}
          </select>
          <div className="text-stone-500 font-sans font-bold text-sm">
            {currentIndex + 1} / {currentData.length}
          </div>
        </div>
        <h1 className="text-lg font-bold text-stone-700 tracking-tight">聽覺破關字卡</h1>
      </header>

      <main className="w-full max-w-3xl flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={`${currentLesson}-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center gap-3"
            >
              <div className="bg-white rounded-[20px] shadow-lg p-3 md:p-4 w-full flex flex-col items-center text-center border border-stone-100">
                <ruby className="text-6xl md:text-7xl font-bold text-stone-800 mb-1 select-none">
                  {currentItem.char}
                  <rt className="text-xl md:text-2xl text-rose-500 font-normal pt-1">{currentItem.pinyin}</rt>
                </ruby>
                
                <div className="h-px w-12 bg-stone-200 my-1" />
                
                <p className="text-base md:text-lg text-emerald-700 leading-tight italic min-h-[2em] max-w-lg">
                  {currentItem.text}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => speak(currentItem.char)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-violet-500 text-white font-bold rounded-lg shadow-md hover:bg-violet-600 active:translate-y-0.5 transition-all text-xs"
                >
                  <Volume2 size={16} />
                  讀字音
                </button>
                <button
                  onClick={() => speak(currentItem.text, 0.85)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-400 text-stone-800 font-bold rounded-lg shadow-md hover:bg-amber-500 active:translate-y-0.5 transition-all text-xs"
                >
                  <Volume2 size={16} />
                  聽口訣
                </button>
                {currentIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-400 text-white font-bold rounded-lg shadow-md hover:bg-stone-500 active:translate-y-0.5 transition-all text-xs"
                  >
                    <ChevronLeft size={16} />
                    上一個字
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-3 py-1.5 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 active:translate-y-0.5 transition-all text-xs"
                >
                  下一個字
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="w-full max-w-md">
                <DrawingPad />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] shadow-2xl p-12 text-center flex flex-col items-center gap-6 border border-stone-100"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Sparkles size={48} />
              </div>
              <h2 className="text-4xl font-bold text-stone-800">🎉 太棒了！</h2>
              <p className="text-xl text-stone-500">本課全數通關！</p>
              <button
                onClick={resetLesson}
                className="mt-4 flex items-center gap-2 px-8 py-4 bg-stone-800 text-white font-bold rounded-2xl shadow-xl hover:bg-stone-900 active:translate-y-1 transition-all"
              >
                <RotateCcw size={24} />
                再練習一次
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-stone-400 text-sm font-sans">
        聽覺破關字卡 (1-6課)
      </footer>
    </div>
  );
}

