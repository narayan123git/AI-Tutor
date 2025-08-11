
import React from 'react';

interface TextBlockProps {
  content: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
     <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
  );
};

export default TextBlock;
