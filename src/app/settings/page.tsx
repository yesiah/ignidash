'use client';

import Card from '@/components/ui/card';
import SectionContainer from '@/components/ui/section-container';
import { Input } from '@/components/catalyst/input';
import { Fieldset, FieldGroup, Field, Label, Legend } from '@/components/catalyst/fieldset';
import { Button } from '@/components/catalyst/button';
import { Text } from '@/components/catalyst/text';

import SettingsNavbar from './settings-navbar';

export default function SettingsPage() {
  return (
    <>
      <SettingsNavbar />
      <main className="mx-auto max-w-prose flex-1 overflow-y-auto pt-[4.25rem]">
        <SectionContainer showBottomBorder={false}>
          <Card>
            <form onSubmit={(e) => e.preventDefault()}>
              <Fieldset>
                <Legend>Profile information</Legend>
                <Text>Update your name, email, and password.</Text>
                <FieldGroup>
                  <div className="flex items-end gap-2">
                    <Field className="flex-1">
                      <Label htmlFor="name">First name</Label>
                      <Input id="name" name="name" autoComplete="given-name" inputMode="text" />
                    </Field>
                    <Button color="rose">Save</Button>
                  </div>
                </FieldGroup>
              </Fieldset>
            </form>
          </Card>
        </SectionContainer>
        <SectionContainer showBottomBorder={false}>
          <Card>This is card text.</Card>
        </SectionContainer>
        <SectionContainer showBottomBorder={false}>
          <Card>This is card text.</Card>
        </SectionContainer>
      </main>
    </>
  );
}
