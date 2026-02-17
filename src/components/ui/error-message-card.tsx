import { XCircleIcon } from '@heroicons/react/20/solid';

import { cn } from '@/lib/utils';

interface ErrorMessageCardProps {
  errorMessage: string | null;
  className?: string;
}

export default function ErrorMessageCard({ errorMessage, className }: ErrorMessageCardProps) {
  return (
    errorMessage && (
      <div role="alert" className={cn('rounded-md bg-red-100 p-4 dark:bg-red-500/15 dark:outline dark:outline-red-500/25', className)}>
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="line-clamp-3 text-sm font-medium text-red-800 dark:text-red-200">{errorMessage}</h3>
          </div>
        </div>
      </div>
    )
  );
}
