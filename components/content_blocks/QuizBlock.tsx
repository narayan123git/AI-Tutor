
import React, { useState } from 'react';
import { QuizQuestion } from '../../types';

const QuestionItem: React.FC<{ question: QuizQuestion; index: number }> = ({ question, index }) => {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
      <p className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
        <span className="text-indigo-500">Q{index + 1}:</span> {question.question}
      </p>
      
      {question.type === 'multiple-choice' && question.options && (
        <ul className="space-y-2 my-4">
          {question.options.map((option, i) => (
            <li key={i} className="flex items-center text-slate-600 dark:text-slate-300">
              <span className="border border-slate-400 dark:border-slate-500 rounded-full w-5 h-5 text-xs flex items-center justify-center mr-3 flex-shrink-0">{String.fromCharCode(65 + i)}</span>
              {option}
            </li>
          ))}
        </ul>
      )}

      <div className="flex space-x-2 mt-4">
        {question.hint && (
          <button onClick={() => setShowHint(!showHint)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}
        <button onClick={() => setShowAnswer(!showAnswer)} className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline">
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>

      {showHint && (
        <p className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-md text-sm">
          <strong>Hint:</strong> {question.hint}
        </p>
      )}

      {showAnswer && (
        <p className="mt-3 p-3 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-md text-sm">
          <strong>Answer:</strong> {question.answer}
        </p>
      )}
    </div>
  );
};

const QuizBlock: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  return (
    <div className="space-y-6 my-4">
      {questions.map((q, i) => (
        <QuestionItem key={i} question={q} index={i} />
      ))}
    </div>
  );
};

export default QuizBlock;
