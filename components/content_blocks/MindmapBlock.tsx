
import React from 'react';
import { MindMapNode } from '../../types';

interface MindMapNodeProps {
  node: MindMapNode;
  level: number;
}

const NodeComponent: React.FC<MindMapNodeProps> = ({ node, level }) => {
  const levelColors = [
    'text-slate-900 dark:text-slate-100', // level 0
    'text-indigo-600 dark:text-indigo-400', // level 1
    'text-sky-600 dark:text-sky-400', // level 2
    'text-teal-600 dark:text-teal-400', // level 3
  ];

  const colorClass = levelColors[level % levelColors.length];
  const fontSizeClass = `text-${['xl', 'lg', 'md', 'base'][Math.min(level, 3)]}`;

  return (
    <li className="my-2">
      <span className={`font-bold ${colorClass} ${fontSizeClass}`}>{node.topic}</span>
      {node.children && node.children.length > 0 && (
        <ul className="pl-6 border-l-2 border-slate-200 dark:border-slate-700 mt-1">
          {node.children.map((child, index) => (
            <NodeComponent key={index} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const MindmapBlock: React.FC<{ nodes: MindMapNode[] }> = ({ nodes }) => {
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg my-4 border border-slate-200 dark:border-slate-700">
      <ul>
        {nodes.map((node, index) => (
          <NodeComponent key={index} node={node} level={0} />
        ))}
      </ul>
    </div>
  );
};

export default MindmapBlock;
