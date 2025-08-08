import { PanelLeft } from 'lucide-react';

export default function SidebarToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={() => {}}
      className="focus-outline hover:bg-background rounded-full p-2 transition-transform hover:scale-110"
    >
      <PanelLeft aria-hidden="true" className="size-5" />
    </button>
  );
}
