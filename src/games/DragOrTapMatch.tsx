import { useEffect, useMemo, useState } from 'react';
import type { GameComponentProps } from './GameComponentProps';
import { speak, speakPraise, speakEncourage } from '../speech/speech';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function DragOrTapMatch({ question, onAnswer }: GameComponentProps) {
  const pairs = question.pairs ?? [];
  const rightItems = useMemo(() => shuffle(pairs.map((p) => p.right)), [question.id]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  useEffect(() => {
    setSelectedLeft(null);
    setMatched(new Set());
    speak(question.speak ?? question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    if (matched.size > 0 && matched.size === pairs.length) {
      speakPraise();
      window.setTimeout(() => onAnswer(true), 500);
    }
  }, [matched, pairs.length, onAnswer]);

  const handleLeftTap = (left: string) => {
    if (matched.has(left)) return;
    setSelectedLeft(left);
  };

  const handleRightTap = (right: string) => {
    if (!selectedLeft) return;
    const pair = pairs.find((p) => p.left === selectedLeft);
    if (pair && pair.right === right) {
      setMatched((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
    } else {
      setWrongFlash(right);
      speakEncourage();
      window.setTimeout(() => setWrongFlash(null), 400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', margin: 0, textAlign: 'center' }}>{question.prompt}</h2>
      <div style={{ display: 'flex', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pairs.map((p) => (
            <button
              key={p.left}
              className="big-tap"
              disabled={matched.has(p.left)}
              onClick={() => handleLeftTap(p.left)}
              style={{
                background: matched.has(p.left)
                  ? 'var(--success)'
                  : selectedLeft === p.left
                    ? 'var(--accent)'
                    : 'var(--surface-solid)',
                border: '3px solid var(--accent)',
                fontSize: '1.8rem',
                padding: '0 1.5rem',
              }}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rightItems.map((right) => {
            const isMatched = pairs.some((p) => p.right === right && matched.has(p.left));
            return (
              <button
                key={right}
                className="big-tap"
                disabled={isMatched}
                onClick={() => handleRightTap(right)}
                style={{
                  background: isMatched ? 'var(--success)' : wrongFlash === right ? 'var(--error)' : 'var(--surface-solid)',
                  border: '3px solid var(--accent-2)',
                  fontSize: '1.8rem',
                  padding: '0 1.5rem',
                }}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
