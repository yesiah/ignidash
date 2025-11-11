'use client';

import { PlusIcon } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';

export default function DashboardColumnHeaderButtons() {
  return (
    <div className="flex items-center gap-x-1">
      <IconButton icon={PlusIcon} label="Create New Plan" onClick={() => {}} surfaceColor="emphasized" />
    </div>
  );
}
