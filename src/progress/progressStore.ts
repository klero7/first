import type { ChildId } from '../content/types';

export interface SetProgress {
  timesCompleted: number;
  bestScore: number;
}

export interface ChildProgress {
  stars: number;
  streakDays: number;
  lastPlayedDate: string | null;
  completedSets: Record<string, SetProgress>;
}

const EMPTY_PROGRESS: ChildProgress = {
  stars: 0,
  streakDays: 0,
  lastPlayedDate: null,
  completedSets: {},
};

const storageKey = (child: ChildId) => `kidsapp:progress:${child}`;

export function loadProgress(child: ChildId): ChildProgress {
  try {
    const raw = localStorage.getItem(storageKey(child));
    if (!raw) return { ...EMPTY_PROGRESS, completedSets: {} };
    const parsed = JSON.parse(raw) as ChildProgress;
    return { ...EMPTY_PROGRESS, ...parsed };
  } catch {
    return { ...EMPTY_PROGRESS, completedSets: {} };
  }
}

export function saveProgress(child: ChildId, progress: ChildProgress): void {
  localStorage.setItem(storageKey(child), JSON.stringify(progress));
}

function isYesterday(prevDate: string, today: string): boolean {
  const prev = new Date(prevDate);
  const cur = new Date(today);
  const diffDays = Math.round((cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export function recordRoundResult(child: ChildId, setId: string, correctCount: number, totalCount: number): ChildProgress {
  const progress = loadProgress(child);
  const today = new Date().toISOString().slice(0, 10);

  const earnedStars = correctCount;
  progress.stars += earnedStars;

  const existing = progress.completedSets[setId] ?? { timesCompleted: 0, bestScore: 0 };
  progress.completedSets[setId] = {
    timesCompleted: existing.timesCompleted + 1,
    bestScore: Math.max(existing.bestScore, totalCount > 0 ? correctCount / totalCount : 0),
  };

  if (progress.lastPlayedDate !== today) {
    if (progress.lastPlayedDate && isYesterday(progress.lastPlayedDate, today)) {
      progress.streakDays += 1;
    } else {
      progress.streakDays = 1;
    }
    progress.lastPlayedDate = today;
  }

  saveProgress(child, progress);
  return progress;
}
