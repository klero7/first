import { parseFrontmatter } from './frontmatter';
import { validateExerciseSet } from './validate';
import type { ChildId, ExerciseSet } from './types';

// Eager + raw: content is bundled into the JS at build time, so it works
// fully offline with no extra runtime fetch or service-worker caching rule.
const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true });

export const exerciseSets: ExerciseSet[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw as string);
    const set = { ...data, body: content, sourceFile: path } as ExerciseSet;
    if (import.meta.env.DEV) validateExerciseSet(set);
    return set;
  })
  .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id));

export function getSetsForChild(child: ChildId): ExerciseSet[] {
  return exerciseSets.filter((s) => s.child === child);
}

export function getSetById(id: string): ExerciseSet | undefined {
  return exerciseSets.find((s) => s.id === id);
}
