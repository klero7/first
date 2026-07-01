import { useCallback, useState } from 'react';
import type { ChildId } from '../content/types';
import { loadProgress, recordRoundResult, type ChildProgress } from './progressStore';

export function useProgress(child: ChildId) {
  const [progress, setProgress] = useState<ChildProgress>(() => loadProgress(child));

  const recordResult = useCallback(
    (setId: string, correctCount: number, totalCount: number) => {
      const updated = recordRoundResult(child, setId, correctCount, totalCount);
      setProgress(updated);
      return updated;
    },
    [child],
  );

  return { progress, recordResult };
}
