'use client';

import Link from 'next/link';
import { SparklesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { Heading } from '@/components/catalyst/heading';
import { useInsightsSelectedPlan } from '@/lib/stores/simulator-store';

function PulseButton({
  n = 4,
  duration = 3.4,
  delay = 0.8,
  gap = 30,
  onClick,
}: {
  n?: number;
  duration?: number;
  delay?: number;
  gap?: number;
  onClick?: () => void;
}) {
  const buttonSize = 120;

  return (
    <motion.div style={{ display: 'grid', placeItems: 'center', position: 'relative' }}>
      {Array.from({ length: n }, (_, i) => {
        const pulseDelay = delay * i;
        const pulseRepeatDelay = pulseDelay;
        const pulseDuration = duration + delay * (n - i);
        return (
          <motion.div
            key={i}
            className={i === 0 ? 'z-10' : ''}
            style={{
              borderRadius: '9999px',
              gridArea: '1 / 1 / 2 / 2',
              ...(i === 0
                ? {}
                : {
                    background: 'radial-gradient(50% 50% at 50% 50%, rgba(244, 63, 94, 0.25) 0%, rgba(251, 113, 133, 0.15) 100%)',
                    border: '2px solid rgba(244, 63, 94, 0.5)',
                    width: `${buttonSize + gap * i}px`,
                    aspectRatio: '1/1',
                    zIndex: n - i,
                  }),
            }}
            {...(i !== 0 && {
              initial: { opacity: 0 },
              animate: { opacity: [0, 1, 0], scale: 1.1 },
              transition: {
                duration: pulseDuration,
                delay: pulseDelay,
                ease: [0.05, 0.6, 0.3, 0.3],
                repeat: Infinity,
                repeatDelay: pulseRepeatDelay,
              },
            })}
          >
            {i === 0 && (
              <motion.button
                onClick={onClick}
                className="bg-emphasized-background hover:bg-background border-border text-foreground flex h-30 w-30 flex-col items-center justify-center gap-2 rounded-full border font-medium shadow-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SparklesIcon className="text-primary h-10 w-10" />
                <span className="text-sm">Generate</span>
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function AIOutput() {
  const selectedPlan = useInsightsSelectedPlan();

  const handleGenerate = () => {
    console.log('Generating insights for: ', selectedPlan?.name);
  };

  return (
    <div className="-mx-2 h-full sm:-mx-3 lg:-mx-4 lg:pr-96">
      <header className="from-emphasized-background to-background border-border/50 flex items-center justify-between border-b bg-gradient-to-l px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {selectedPlan ? (
          <Heading level={3}>
            Insights for{' '}
            <Link
              href={`/dashboard/simulator/${selectedPlan?.id}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedPlan?.name}
            </Link>
          </Heading>
        ) : (
          <Heading level={3}>
            Select a plan <span aria-hidden="true">&rarr;</span>
          </Heading>
        )}
      </header>
      <div className="flex h-full flex-col items-center justify-center">
        <PulseButton onClick={handleGenerate} />
      </div>
    </div>
  );
}
