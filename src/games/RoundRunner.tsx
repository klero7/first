import { useMemo, useState } from 'react';
import type { ExerciseSet, Question, QuestionDisplay, Theme } from '../content/types';
import { ProgressBar } from './ProgressBar';
import { RewardOverlay } from './RewardOverlay';
import { MultipleChoiceCard } from './MultipleChoiceCard';
import { CountTheObjects } from './CountTheObjects';
import { NumberLine } from './NumberLine';
import { LetterMatch } from './LetterMatch';
import { AdditionSubtraction } from './AdditionSubtraction';
import { DragOrTapMatch } from './DragOrTapMatch';
import type { GameComponentProps } from './GameComponentProps';

const componentRegistry: Record<QuestionDisplay, React.FC<GameComponentProps>> = {
  'multiple-choice': MultipleChoiceCard,
  'tap-count': CountTheObjects,
  'number-line': NumberLine,
  'letter-card': LetterMatch,
  'count-visual': AdditionSubtraction,
  'match-pairs': DragOrTapMatch,
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function RoundRunner({
  set,
  theme,
  onExit,
  onComplete,
}: {
  set: ExerciseSet;
  theme: Theme;
  onExit: () => void;
  onComplete: (correctCount: number, totalCount: number) => void;
}) {
  const roundQuestions = useMemo<Question[]>(
    () => shuffle(set.questions).slice(0, set.roundSize),
    [set.id, set.roundSize],
  );

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = roundQuestions[index];
  const GameComponent = componentRegistry[question.display];

  const handleAnswer = (correct: boolean) => {
    const nextCorrect = correct ? correctCount + 1 : correctCount;
    setCorrectCount(nextCorrect);
    if (index + 1 >= roundQuestions.length) {
      setFinished(true);
      onComplete(nextCorrect, roundQuestions.length);
    } else {
      setIndex(index + 1);
    }
  };

  const handleReplay = () => {
    setIndex(0);
    setCorrectCount(0);
    setFinished(false);
  };

  return (
    <div className="app-shell">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
        <button
          onClick={onExit}
          className="big-tap"
          style={{ background: 'transparent', color: 'var(--text)', minWidth: 'auto', minHeight: 'auto', fontSize: '1rem' }}
        >
          ← Назад
        </button>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>
          {set.emoji} {set.title}
        </h1>
        <div style={{ width: '4rem' }} />
      </div>
      <ProgressBar current={index} total={roundQuestions.length} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        {!finished && <GameComponent key={question.id} question={question} onAnswer={handleAnswer} theme={theme} />}
      </div>
      {finished && (
        <RewardOverlay correctCount={correctCount} totalCount={roundQuestions.length} onReplay={handleReplay} onHome={onExit} />
      )}
    </div>
  );
}
