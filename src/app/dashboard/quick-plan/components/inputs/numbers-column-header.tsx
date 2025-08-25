'use client';

import { useState } from 'react';
import { CalculatorIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import IconButton from '@/components/ui/icon-button';
import Drawer from '@/components/ui/drawer';
import ColumnHeader from '@/components/ui/column-header';

import PreferencesDrawer from './drawers/preferences-drawer';

export default function NumbersColumnHeader() {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const titleComponent = (
    <div className="flex items-center gap-2">
      <AdjustmentsHorizontalIcon className="text-primary size-6 shrink-0" aria-hidden="true" />
      <span>Preferences</span>
    </div>
  );

  return (
    <>
      <ColumnHeader
        title="Numbers"
        icon={CalculatorIcon}
        iconButton={
          <IconButton
            icon={AdjustmentsHorizontalIcon}
            label="Preferences"
            onClick={() => setPreferencesOpen(true)}
            surfaceColor="emphasized"
          />
        }
      />

      <Drawer open={preferencesOpen} setOpen={setPreferencesOpen} title={titleComponent}>
        <PreferencesDrawer />
      </Drawer>
    </>
  );
}
