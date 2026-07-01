export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: '2.5rem',
            height: '0.6rem',
            borderRadius: '999px',
            background: i < current ? 'var(--accent)' : 'var(--surface)',
          }}
        />
      ))}
    </div>
  );
}
