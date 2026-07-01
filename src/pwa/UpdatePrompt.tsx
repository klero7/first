import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--surface-solid)',
        color: 'var(--text)',
        border: '2px solid var(--accent)',
        borderRadius: '1rem',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 200,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <span>Доступно новое задание!</span>
      <button
        className="big-tap"
        onClick={() => updateServiceWorker(true)}
        style={{ minWidth: 'auto', minHeight: 'auto', padding: '0.5rem 1rem', background: 'var(--accent)', color: '#0b1130' }}
      >
        Обновить
      </button>
    </div>
  );
}
