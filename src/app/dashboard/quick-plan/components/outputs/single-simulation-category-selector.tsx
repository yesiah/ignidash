'use client';

import { cn } from '@/lib/utils';
import { SimulationCategory } from '@/lib/types/simulation-category';

interface SimulationCategorySelectorProps {
  className?: string;
  setCurrentCategory: (category: SimulationCategory) => void;
  currentCategory: SimulationCategory;
}

export default function SimulationCategorySelector({ className, setCurrentCategory, currentCategory }: SimulationCategorySelectorProps) {
  return (
    <div className={cn('isolate -ml-1 flex gap-x-2 overflow-x-auto py-2 pl-1', className)}>
      {Object.values(SimulationCategory).map((category) => (
        <button
          key={category}
          onClick={() => setCurrentCategory(category)}
          type="button"
          className={cn(
            'text-muted-foreground bg-background hover:bg-emphasized-background focus-outline border-border relative inline-flex items-center rounded-full border px-3 py-2 text-sm font-semibold focus:z-10',
            { 'text-foreground bg-emphasized-background': currentCategory === category }
          )}
        >
          <span className="whitespace-nowrap">{category}</span>
        </button>
      ))}
    </div>
  );
}
