'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

interface ButtonGroupProps {
  className?: string;
  firstButtonText: string;
  firstButtonOnClick: () => void;
  middleButtonText?: string;
  middleButtonOnClick?: () => void;
  lastButtonText: string;
  lastButtonOnClick: () => void;
}

export default function ButtonGroup({
  className,
  firstButtonText,
  firstButtonOnClick,
  middleButtonText,
  middleButtonOnClick,
  lastButtonText,
  lastButtonOnClick,
}: ButtonGroupProps) {
  const [activeButton, setActiveButton] = useState<'first' | 'middle' | 'last' | null>(null);

  const handleFirstClick = () => {
    setActiveButton('first');
    firstButtonOnClick();
  };

  const handleMiddleClick = () => {
    setActiveButton('middle');
    middleButtonOnClick?.();
  };

  const handleLastClick = () => {
    setActiveButton('last');
    lastButtonOnClick();
  };

  return (
    <span className={cn('isolate inline-flex rounded-md shadow-xs', className)}>
      <button
        onClick={handleFirstClick}
        type="button"
        className={cn(
          'text-muted-foreground bg-emphasized-background ring-border hover:bg-background dark:bg-background dark:hover:bg-emphasized-background relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
          { 'text-foreground bg-background dark:bg-emphasized-background': activeButton === 'first' }
        )}
      >
        {firstButtonText}
      </button>
      {middleButtonText && middleButtonOnClick && (
        <button
          onClick={handleMiddleClick}
          type="button"
          className={cn(
            'text-muted-foreground bg-emphasized-background ring-border hover:bg-background dark:bg-background dark:hover:bg-emphasized-background relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
            { 'text-foreground bg-background dark:bg-emphasized-background': activeButton === 'middle' }
          )}
        >
          {middleButtonText}
        </button>
      )}
      <button
        onClick={handleLastClick}
        type="button"
        className={cn(
          'text-muted-foreground bg-emphasized-background ring-border hover:bg-background dark:bg-background dark:hover:bg-emphasized-background relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
          { 'text-foreground bg-background dark:bg-emphasized-background': activeButton === 'last' }
        )}
      >
        {lastButtonText}
      </button>
    </span>
  );
}
