import { cn } from '@/lib/utils';

interface SidebarTextProps {
  children: React.ReactNode;
  className?: string;
  'aria-hidden'?: React.ComponentPropsWithoutRef<'span'>['aria-hidden'];
}

export default function SidebarText({ children, className, 'aria-hidden': ariaHidden }: SidebarTextProps) {
  return (
    <span
      className={cn(
        'ml-1 inline overflow-hidden whitespace-nowrap transition-[width,opacity] duration-200 ease-in-out group-data-[state=collapsed]/sidebar:w-0 group-data-[state=collapsed]/sidebar:opacity-0 motion-reduce:transition-none',
        className
      )}
      aria-hidden={ariaHidden}
    >
      {children}
    </span>
  );
}
