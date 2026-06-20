import PublicAppShell from '@/components/public/PublicAppShell';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { MarketingNav } from '@/components/marketing/MarketingNav';

type MarketingShellProps = {
  children: React.ReactNode;
  /** Ink for the Linear-style homepage; paper for inner marketing routes. */
  tone?: 'ink' | 'paper';
};

export function MarketingShell({ children, tone = 'paper' }: MarketingShellProps) {
  return (
    <PublicAppShell
      className={
        tone === 'ink' ? 'bg-pub-ink text-pub-ink-muted' : 'bg-pub-surface text-pub-ink-muted'
      }
    >
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </PublicAppShell>
  );
}
