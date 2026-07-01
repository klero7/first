export type ChildId = 'timur' | 'samira';

export type Theme = 'space' | 'cosmetics';

export type QuestionDisplay =
  | 'count-visual'
  | 'tap-count'
  | 'multiple-choice'
  | 'letter-card'
  | 'number-line'
  | 'match-pairs';

export interface Choice {
  label: string;
  correct: boolean;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  prompt: string;
  display: QuestionDisplay;
  visualAsset?: string;
  choices?: Choice[];
  speak?: string;
  pairs?: MatchPair[];
  /** Addends for `count-visual` (addition/subtraction with visuals), e.g. [2, 3] for 2+3, [5, -2] for 5-2. */
  addends?: number[];
  /** Number of objects to render for a `tap-count` counting game. */
  count?: number;
  /** First number shown in a short sequence for `number-line` ("what comes next"). */
  sequenceStart?: number;
  /** Step between numbers in a `number-line` sequence, e.g. 2 for skip-counting by twos. Defaults to 1. */
  sequenceStep?: number;
}

export interface ExerciseSet {
  id: string;
  child: ChildId;
  category: string;
  type: string;
  title: string;
  theme: Theme;
  difficulty: 1 | 2 | 3;
  emoji: string;
  roundSize: number;
  questions: Question[];
  body: string;
  sourceFile: string;
}
