import type { ExerciseSet } from './types';

const KNOWN_CHILDREN = new Set(['timur', 'samira']);
const KNOWN_DISPLAYS = new Set(['count-visual', 'tap-count', 'multiple-choice', 'letter-card', 'number-line', 'match-pairs']);

// Dev-time-only sanity checks for hand-authored markdown content. Throws a
// console error naming the offending file so authoring mistakes (a very
// real risk when editing YAML-ish frontmatter by hand) surface immediately
// instead of silently breaking a game screen.
export function validateExerciseSet(set: ExerciseSet): void {
  const errors: string[] = [];
  const file = set.sourceFile ?? '(unknown file)';

  if (!set.id) errors.push('missing id');
  if (!KNOWN_CHILDREN.has(set.child)) errors.push(`unknown child "${set.child}"`);
  if (!set.title) errors.push('missing title');
  if (!Array.isArray(set.questions) || set.questions.length === 0) {
    errors.push('missing or empty questions array');
  } else {
    if (set.roundSize > set.questions.length) {
      errors.push(`roundSize (${set.roundSize}) is larger than questions.length (${set.questions.length})`);
    }
    set.questions.forEach((q, idx) => {
      const label = `questions[${idx}] (id: ${q?.id ?? '?'})`;
      if (!q.id) errors.push(`${label}: missing id`);
      if (!q.prompt) errors.push(`${label}: missing prompt`);
      if (!KNOWN_DISPLAYS.has(q.display)) errors.push(`${label}: unknown display "${q.display}"`);
      if (q.display === 'match-pairs') {
        if (!Array.isArray(q.pairs) || q.pairs.length === 0) {
          errors.push(`${label}: match-pairs requires a non-empty pairs array`);
        }
      } else {
        if (!Array.isArray(q.choices) || q.choices.length === 0) {
          errors.push(`${label}: missing or empty choices array`);
        } else {
          const correctCount = q.choices.filter((c) => c.correct).length;
          if (correctCount !== 1) {
            errors.push(`${label}: expected exactly 1 correct choice, found ${correctCount}`);
          }
        }
      }
    });
  }

  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`[content] Invalid exercise set in ${file}:\n  - ${errors.join('\n  - ')}`);
  }
}
