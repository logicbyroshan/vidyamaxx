import * as React from 'react';
import { useGlobalStore } from '../stores/globalStore';

export function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = React.useState<'in' | 'hold' | 'out'>('in');
  const { setHasSeenPreloader } = useGlobalStore();

  React.useEffect(() => {
    // Phase: in (0-600ms) → hold (600-2200ms) → out (2200-2800ms)
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 2200);
    const t3 = setTimeout(() => {
      setHasSeenPreloader();
      onDone();
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone, setHasSeenPreloader]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 select-none"
      style={{ opacity: phase === 'out' ? 0 : 1, pointerEvents: phase === 'out' ? 'none' : 'all' }}
    >
      {/* Soft minimal radial glow */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[120px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Clean minimal Logo + Wordmark */}
      <div
        className="relative z-10 flex flex-col items-center gap-5 transition-all duration-700"
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        {/* Brand Logo */}
        <div className="relative flex items-center justify-center">
          <img
            src="/logo.png"
            alt="VidyaFlow Logo"
            className="h-16 w-16 object-contain drop-shadow-[0_0_20px_rgba(234,88,12,0.35)]"
          />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Vidya<span className="text-primary">Flow</span>
          </h1>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-44 h-1 bg-[#181818] rounded-full overflow-hidden mt-1 border border-[#242424]">
          <div
            className="h-full bg-primary rounded-full transition-all duration-[1600ms] ease-out shadow-xs"
            style={{ width: phase === 'in' ? '0%' : phase === 'hold' ? '85%' : '100%' }}
          />
        </div>

        {/* Status text */}
        <p className="text-[11px] font-mono text-zinc-400">
          {phase === 'in' ? 'Initializing system...' : phase === 'hold' ? 'Loading campus modules...' : 'Ready'}
        </p>
      </div>
    </div>
  );
}
