import type { ReactNode } from 'react';
import theme from '@/components/design-3/theme.module.css';

export default function DesignThreeLayout({ children }: { children: ReactNode }) {
  return <div className={theme.theme}>{children}</div>;
}
