import type { ReactNode } from 'react';

type MarketingPageBodyProps = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function MarketingPageBody({
  children,
  className = '',
  narrow = false,
}: MarketingPageBodyProps) {
  return (
    <div
      className={`mx-auto px-6 pb-24 sm:px-12 ${narrow ? 'max-w-[720px]' : 'max-w-[1100px]'} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
