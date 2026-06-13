import PublicAppShell from '@/components/public/PublicAppShell';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
 return <PublicAppShell>{children}</PublicAppShell>;
}
