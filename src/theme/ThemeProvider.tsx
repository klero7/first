import { useEffect } from 'react';
import type { Theme } from '../content/types';

export function ThemeProvider({ theme, children }: { theme: Theme | null; children: React.ReactNode }) {
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return <>{children}</>;
}
