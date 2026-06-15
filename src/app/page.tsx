import { redirect } from 'next/navigation';
import { isModuleLicensed } from '@/lib/modules';

/** Public entry: careers when ATS is licensed; otherwise staff login (Imara BMS wedge). */
export default function Home() {
  if (isModuleLicensed('ats')) {
    redirect('/careers');
  }
  redirect('/dashboard/login');
}
