import type { Question, Theme } from '../content/types';

export interface GameComponentProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  theme: Theme;
}
