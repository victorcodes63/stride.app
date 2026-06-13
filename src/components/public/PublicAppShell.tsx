type PublicAppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PublicAppShell({ children, className = '' }: PublicAppShellProps) {
  return (
    <div className={`public-app min-h-screen bg-white font-pub ${className}`.trim()}>
      {children}
    </div>
  );
}
