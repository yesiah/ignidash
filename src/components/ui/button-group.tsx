'use client';

import { useState } from 'react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ButtonGroupProps {
  className?: string;
  firstButtonText: string;
  firstButtonIcon: ReactNode;
  firstButtonOnClick: () => void;
  middleButtonText?: string;
  middleButtonIcon?: ReactNode;
  middleButtonOnClick?: () => void;
  lastButtonText: string;
  lastButtonIcon: ReactNode;
  lastButtonOnClick: () => void;
  defaultActiveButton?: 'first' | 'middle' | 'last' | null;
}

export default function ButtonGroup({
  className,
  firstButtonText,
  firstButtonIcon,
  firstButtonOnClick,
  middleButtonText,
  middleButtonIcon,
  middleButtonOnClick,
  lastButtonText,
  lastButtonIcon,
  lastButtonOnClick,
  defaultActiveButton = null,
}: ButtonGroupProps) {
  const [activeButton, setActiveButton] = useState<'first' | 'middle' | 'last' | null>(defaultActiveButton);

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
          'text-muted-foreground bg-emphasized-background ring-border hover:bg-background dark:bg-background dark:hover:bg-emphasized-background focus-outline relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
          { 'text-foreground bg-background dark:bg-emphasized-background': activeButton === 'first' }
        )}
      >
        <span className="text-primary h-5 w-5 md:mr-1.5">{firstButtonIcon}</span>
        <span className="hidden whitespace-nowrap md:inline">{firstButtonText}</span>
      </button>
      {middleButtonText && middleButtonOnClick && (
        <button
          onClick={handleMiddleClick}
          type="button"
          className={cn(
            'text-muted-foreground bg-emphasized-background ring-border hover:bg-background dark:bg-background dark:hover:bg-emphasized-background focus-outline relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
            { 'text-foreground bg-background dark:bg-emphasized-background': activeButton === 'middle' }
          )}
        >
          {middleButtonIcon && <span className="text-primary h-5 w-5 md:mr-1.5">{middleButtonIcon}</span>}
          <span className="hidden whitespace-nowrap md:inline">{middleButtonText}</span>
        </button>
      )}
      <button
        onClick={handleLastClick}
        type="button"
        className={cn(
          'text-muted-foreground bg-emphasized-background ring-border hover:bg-background dark:bg-background dark:hover:bg-emphasized-background focus-outline relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
          { 'text-foreground bg-background dark:bg-emphasized-background': activeButton === 'last' }
        )}
      >
        <span className="text-primary h-5 w-5 md:mr-1.5">{lastButtonIcon}</span>
        <span className="hidden whitespace-nowrap md:inline">{lastButtonText}</span>
      </button>
    </span>
  );
}
