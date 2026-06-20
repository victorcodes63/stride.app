'use client';

import { useEffect, useState } from 'react';
import {
  ChromaFlow,
  FilmGrain,
  FlutedGlass,
  Shader,
  Swirl,
} from 'shaders/react';
import { MARKETING_BRAND, MARKETING_HERO_SHADER } from '@/lib/marketing-config';

const { swirl, chromaFlow, flutedGlass, filmGrain } = MARKETING_HERO_SHADER;

export function HeroShaderFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${MARKETING_BRAND.paper} 0%, ${MARKETING_BRAND.paper2} 52%, ${MARKETING_BRAND.paper} 100%)`,
        }}
      />
      <div
        className="absolute -right-[10%] bottom-[-8%] h-[72%] w-[68%] rounded-full opacity-[0.22] blur-[88px]"
        style={{
          background: `radial-gradient(circle, ${MARKETING_BRAND.coral} 0%, transparent 68%)`,
          animation: 'sc-hero-drift-a 28s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -left-[12%] top-[8%] h-[58%] w-[54%] rounded-full opacity-[0.12] blur-[72px]"
        style={{
          background: `radial-gradient(circle, ${MARKETING_BRAND.coral} 0%, transparent 70%)`,
          animation: 'sc-hero-drift-b 34s ease-in-out infinite alternate-reverse',
        }}
      />
      <style>{`
        @keyframes sc-hero-drift-a {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(-4%, -5%) scale(1.06); }
        }
        @keyframes sc-hero-drift-b {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(5%, 4%) scale(1.04); }
        }
      `}</style>
    </div>
  );
}

export function HeroShaderCanvas() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (String(event.message).toLowerCase().includes('shader')) {
        setFailed(true);
      }
    };
    window.addEventListener('error', onError);
    return () => window.removeEventListener('error', onError);
  }, []);

  if (failed) {
    return <HeroShaderFallback />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] min-h-full w-full" aria-hidden>
      <Shader className="h-full min-h-full w-full" colorSpace="oklch" onReady={() => setFailed(false)}>
        <FilmGrain strength={filmGrain.strength}>
          <FlutedGlass {...flutedGlass}>
            <ChromaFlow {...chromaFlow}>
              <Swirl {...swirl} />
            </ChromaFlow>
          </FlutedGlass>
        </FilmGrain>
      </Shader>
    </div>
  );
}
