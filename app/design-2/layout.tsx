import type { ReactNode } from 'react';
import theme from '@/components/design-2/theme.module.css';

export default function DesignTwoLayout({ children }: { children: ReactNode }) {
  return <div className={theme.theme}>{children}</div>;
}
