import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Cursor } from '@/components/effects/Cursor';
import { ScrollProvider } from '@/components/effects/ScrollProvider';
import { AmbientParticles } from '@/components/effects/AmbientParticles';
import { Navigation } from '@/components/effects/Navigation';
import { ErrorBoundary } from '@/components/effects/ErrorBoundary';
import { Loader } from '@/components/Loader/Loader';
import { Hero } from '@/components/Hero/Hero';
import { About } from '@/components/About/About';
import { Pedigree } from '@/components/Pedigree/Pedigree';
import { Experience } from '@/components/Experience/Experience';
import { Skills } from '@/components/Skills/Skills';
import { Projects } from '@/components/Projects/Projects';
import { Contact } from '@/components/Contact/Contact';

export default function App() {
  const loaded = useAppStore((s) => s.loaded);

  useEffect(() => {
    if (loaded) {
      // Force the page to start at the Hero, regardless of prior scroll state.
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }
  }, [loaded]);

  return (
    <div className="vignette">
      <Loader />

      {loaded && (
        <ScrollProvider>
          <Cursor />
          <Navigation />
          <AmbientParticles />
          <div className="grain" />

          <main className="relative z-10">
            <ErrorBoundary label="Hero"><Hero /></ErrorBoundary>
            <ErrorBoundary label="About"><About /></ErrorBoundary>
            <ErrorBoundary label="Pedigree"><Pedigree /></ErrorBoundary>
            <ErrorBoundary label="Experience"><Experience /></ErrorBoundary>
            <ErrorBoundary label="Skills"><Skills /></ErrorBoundary>
            <ErrorBoundary label="Projects"><Projects /></ErrorBoundary>
            <ErrorBoundary label="Contact"><Contact /></ErrorBoundary>
          </main>
        </ScrollProvider>
      )}
    </div>
  );
}
