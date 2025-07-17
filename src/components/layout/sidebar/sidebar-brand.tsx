import { FireIcon } from '@heroicons/react/24/solid';
import { ModeToggle } from '@/components/providers/mode-toggle';

export default function SidebarBrand() {
  return (
    <div className="border-border flex h-16 shrink-0 items-center justify-between gap-2 border-b">
      <div className="flex items-center gap-2">
        <FireIcon className="text-primary h-8 w-8" aria-hidden="true" />
        <span className="text-xl font-semibold">Ignidash</span>
      </div>
      <ModeToggle />
    </div>
  );
}
