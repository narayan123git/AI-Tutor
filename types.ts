
export interface QuizQuestion {
  question: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'short-answer';
  options?: string[];
  answer: string;
  hint: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface MindMapNode {
  topic: string;
  children?: MindMapNode[];
}

export type ContentBlock = 
  | { type: 'text'; content: string; }
  | { type: 'code'; language: string; content: string; }
  | { type: 'quiz'; questions: QuizQuestion[]; }
  | { type: 'flashcards'; cards: Flashcard[]; }
  | { type: 'mindmap'; nodes: MindMapNode[]; };

export interface Extras {
  exam_tips?: string[];
  common_mistakes?: string[];
  real_world_applications?: string[];
}

export interface TutorResponse {
  title: string;
  summary: string;
  content_blocks: ContentBlock[];
  extra: Extras;
}

export enum InteractionMode {
  Explain = 'Explain',
  Code = 'Code',
  Quiz = 'Quiz',
  Flashcards = 'Flashcards',
  Exam = 'Exam',
  Project = 'Project',
  Plan = 'Plan',
  Map = 'Map',
}
