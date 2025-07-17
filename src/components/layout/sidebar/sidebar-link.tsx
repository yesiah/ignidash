import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  href: string;
  current: boolean;
  children: React.ReactNode;
}

export default function SidebarLink({ href, current, children }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        current ? 'bg-background text-primary ring-primary ring' : 'hover:bg-background',
        'group focus-outline flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
      )}
    >
      {children}
    </Link>
  );
}
