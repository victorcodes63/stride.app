'use client';

import dynamic from 'next/dynamic';
import { HeroShaderFallback } from './HeroShaderCanvas';

const HeroShaderCanvas = dynamic(
  () => import('./HeroShaderCanvas').then((mod) => mod.HeroShaderCanvas),
  {
    ssr: false,
    loading: () => <HeroShaderFallback />,
  },
);

export function HeroShaderBackground() {
  return <HeroShaderCanvas />;
}
