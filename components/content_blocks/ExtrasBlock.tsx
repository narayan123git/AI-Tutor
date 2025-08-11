
import React from 'react';
import { Extras } from '../../types';

interface ExtrasBlockProps {
  extra: Extras;
}

const ExtrasBlock: React.FC<ExtrasBlockProps> = ({ extra }) => {
  const hasContent = extra.exam_tips?.length || extra.common_mistakes?.length || extra.real_world_applications?.length;

  if (!hasContent) {
    return null;
  }

  const renderList = (title: string, items: string[] | undefined, icon: React.ReactNode) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-sm">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const tipIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
  const mistakeIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
  const appIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


  return (
    <div className="mt-8">
       <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Extra Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderList('Exam Tips', extra.exam_tips, tipIcon)}
        {renderList('Common Mistakes', extra.common_mistakes, mistakeIcon)}
        {renderList('Real-World Applications', extra.real_world_applications, appIcon)}
      </div>
    </div>
  );
};

export default ExtrasBlock;
