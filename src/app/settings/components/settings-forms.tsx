'use client';

import Card from '@/components/ui/card';
import SectionContainer from '@/components/ui/section-container';
import SuccessNotification from '@/components/ui/success-notification';
import { useSuccessNotification } from '@/hooks/use-success-notification';

import ProfileInfoForm from './profile-info-form';

interface SettingsFormsProps {
  fetchedName: string;
  fetchedEmail: string;
}

export default function SettingsForms({ fetchedName, fetchedEmail }: SettingsFormsProps) {
  const { notificationState, showSuccessNotification, setShow } = useSuccessNotification();

  return (
    <>
      <main className="mx-auto max-w-prose flex-1 overflow-y-auto px-4 pt-[4.25rem]">
        <ProfileInfoForm fetchedName={fetchedName} fetchedEmail={fetchedEmail} showSuccessNotification={showSuccessNotification} />
        <SectionContainer showBottomBorder>
          <Card>This is card text.</Card>
        </SectionContainer>
        <SectionContainer showBottomBorder={false}>
          <Card>This is card text.</Card>
        </SectionContainer>
      </main>
      <SuccessNotification {...notificationState} setShow={setShow} />
    </>
  );
}
