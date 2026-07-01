import { useState } from 'react';
import type { Choice } from '../content/types';
import { speakPraise, speakEncourage } from '../speech/speech';

export function ChoiceButtons({
  choices,
  onAnswer,
}: {
  choices: Choice[];
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  const handlePick = (choice: Choice) => {
    if (picked) return;
    setPicked(choice.label);
    if (choice.correct) speakPraise();
    else speakEncourage();
    window.setTimeout(() => onAnswer(choice.correct), 550);
  };

  return (
    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {choices.map((choice) => {
        const isPicked = picked === choice.label;
        const showResult = picked !== null;
        const bg = !showResult
          ? 'var(--surface-solid)'
          : isPicked
            ? choice.correct
              ? 'var(--success)'
              : 'var(--error)'
            : 'var(--surface-solid)';
        const feedbackClass = isPicked ? (choice.correct ? 'pop-correct' : 'shake-wrong') : '';
        return (
          <button
            key={choice.label}
            className={`big-tap ${feedbackClass}`}
            disabled={picked !== null}
            onClick={() => handlePick(choice)}
            style={{
              background: bg,
              color: showResult && isPicked ? '#0b1130' : 'var(--text)',
              border: '3px solid var(--accent)',
              minWidth: '6rem',
              padding: '0 1.5rem',
            }}
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}
