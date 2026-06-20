import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { StudioCraftNav } from '@/components/marketing/v3/StudioCraftNav';
import { StudioCraftShell } from '@/components/marketing/v3/StudioCraftShell';

type MarketingShellProps = {
  children: React.ReactNode;
};

/** Inner marketing routes — same studio-craft nav as the homepage. */
export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <StudioCraftShell>
      <div className="fixed inset-x-0 top-0 z-[100] pt-2 sm:pt-3">
        <StudioCraftNav />
      </div>
      <main>{children}</main>
      <MarketingFooter />
    </StudioCraftShell>
  );
}
