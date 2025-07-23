import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-emphasized-background border-border my-4 overflow-hidden rounded-xl border shadow-md', className)}>
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
