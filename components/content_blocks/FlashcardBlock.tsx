
import React, { useState } from 'react';
import { Flashcard } from '../../types';

interface FlashcardBlockProps {
  cards: Flashcard[];
}

const FlashcardItem: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-48 perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-700 rounded-xl shadow-lg flex items-center justify-center p-4 cursor-pointer border border-slate-200 dark:border-slate-600">
          <p className="text-lg font-medium text-center text-slate-800 dark:text-slate-100">{card.question}</p>
        </div>
        
        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-500 dark:bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center p-4 cursor-pointer">
          <p className="text-md text-center text-white">{card.answer}</p>
        </div>
      </div>
    </div>
  );
};


const FlashcardBlock: React.FC<FlashcardBlockProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
      {cards.map((card, index) => (
        <FlashcardItem key={index} card={card} />
      ))}
    </div>
  );
};

export default FlashcardBlock;
