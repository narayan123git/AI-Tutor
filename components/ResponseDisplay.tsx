
import React from 'react';
import { TutorResponse, ContentBlock } from '../types';
import TextBlock from './content_blocks/TextBlock';
import CodeBlock from './content_blocks/CodeBlock';
import FlashcardBlock from './content_blocks/FlashcardBlock';
import QuizBlock from './content_blocks/QuizBlock';
import MindmapBlock from './content_blocks/MindmapBlock';
import ExtrasBlock from './content_blocks/ExtrasBlock';

interface ResponseDisplayProps {
  data: TutorResponse;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ data }) => {
  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return <TextBlock key={index} content={block.content} />;
      case 'code':
        return <CodeBlock key={index} language={block.language} content={block.content} />;
      case 'flashcards':
        return <FlashcardBlock key={index} cards={block.cards} />;
      case 'quiz':
        return <QuizBlock key={index} questions={block.questions} />;
      case 'mindmap':
        return <MindmapBlock key={index} nodes={block.nodes} />;
      default:
        return <div key={index} className="text-red-500">Unsupported content type</div>;
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{data.title}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{data.summary}</p>
      </header>
      
      <main className="space-y-8">
        {data.content_blocks.map((block, index) => (
          <div key={index} className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6">
            {renderContentBlock(block, index)}
          </div>
        ))}
      </main>

      <ExtrasBlock extra={data.extra} />
    </div>
  );
};

export default ResponseDisplay;
