'use client';

import { useState } from 'react';
import { LandmarkIcon, PiggyBankIcon, TrendingUpIcon } from 'lucide-react';

import DisclosureSection from '@/components/ui/disclosure-section';
import { Dialog } from '@/components/catalyst/dialog';

import AccountDialog from '../dialogs/account-dialog';
import SavingsDialog from '../dialogs/savings-dialog';

export default function PortfolioSection() {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedAccountID, setSelectedAccountID] = useState<string | null>(null);

  const [savingsDialogOpen, setSavingsDialogOpen] = useState(false);
  const [selectedSavingsID, setSelectedSavingsID] = useState<string | null>(null);

  return (
    <>
      <DisclosureSection title="Portfolio" icon={LandmarkIcon}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="focus-outline relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 dark:border-white/15 dark:hover:border-white/25"
            onClick={() => setSavingsDialogOpen(true)}
          >
            <PiggyBankIcon aria-hidden="true" className="text-primary mx-auto size-12" />
            <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-white">Add savings</span>
          </button>
          <button
            type="button"
            className="focus-outline relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 dark:border-white/15 dark:hover:border-white/25"
            onClick={() => setAccountDialogOpen(true)}
          >
            <TrendingUpIcon aria-hidden="true" className="text-primary mx-auto size-12" />
            <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-white">Add investment</span>
          </button>
        </div>
        <Dialog
          size="xl"
          open={accountDialogOpen}
          onClose={() => {
            setSelectedAccountID(null);
            setAccountDialogOpen(false);
          }}
        >
          <AccountDialog setAccountDialogOpen={setAccountDialogOpen} selectedAccountID={selectedAccountID} />
        </Dialog>
        <Dialog
          size="xl"
          open={savingsDialogOpen}
          onClose={() => {
            setSelectedSavingsID(null);
            setSavingsDialogOpen(false);
          }}
        >
          <SavingsDialog setSavingsDialogOpen={setSavingsDialogOpen} selectedAccountID={selectedSavingsID} />
        </Dialog>
      </DisclosureSection>
    </>
  );
}
