import { useEffect } from 'react';
import type { GameComponentProps } from './GameComponentProps';
import { ChoiceButtons } from './ChoiceButtons';
import { assetEmoji } from './assets';
import { speak } from '../speech/speech';

export function AdditionSubtraction({ question, onAnswer }: GameComponentProps) {
  const [a, b] = question.addends ?? [0, 0];
  const emoji = assetEmoji(question.visualAsset);
  const isSubtraction = b < 0;

  useEffect(() => {
    speak(question.speak ?? question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2rem', margin: 0 }}>{question.prompt}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '2.5rem' }}>
        <span>{emoji.repeat(Math.max(a, 0))}</span>
        <span style={{ fontSize: '2rem' }}>{isSubtraction ? '−' : '+'}</span>
        <span>{emoji.repeat(Math.abs(b))}</span>
      </div>
      <ChoiceButtons choices={question.choices ?? []} onAnswer={onAnswer} />
    </div>
  );
}
