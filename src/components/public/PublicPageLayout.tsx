import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PublicPageLayoutProps = {
  children: React.ReactNode;
  /** Skip footer on focused flows (e.g. minimal auth) */
  showFooter?: boolean;
};

export default function PublicPageLayout({ children, showFooter = true }: PublicPageLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      {showFooter ? <Footer /> : null}
    </>
  );
}
