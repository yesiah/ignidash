'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import Card from '@/components/ui/card';
import SectionContainer from '@/components/ui/section-container';
import { Input } from '@/components/catalyst/input';
import { Fieldset, FieldGroup, Field, Label, Legend, ErrorMessage } from '@/components/catalyst/fieldset';
import { Button } from '@/components/catalyst/button';
import { Text } from '@/components/catalyst/text';
import { Divider } from '@/components/catalyst/divider';
import { DialogActions } from '@/components/catalyst/dialog';
import { authClient } from '@/lib/auth-client';

import SettingsNavbar from './settings-navbar';

export default function SettingsPage() {
  const user = useQuery(api.auth.getCurrentUserSafe);

  const currentName = user?.name ?? 'Anonymous';
  const [name, setName] = useState(currentName);
  const [nameFieldError, setNameFieldError] = useState<string | null>(null);

  const handleNameSave = async () => {
    await authClient.updateUser(
      { name },
      {
        onError: (ctx) => {
          setNameFieldError(ctx.error.message);
        },
        onRequest() {
          setNameFieldError(null);
        },
        onSuccess: (ctx) => {
          setNameFieldError(null);
        },
      }
    );
  };

  const currentEmail = user?.email ?? '';
  const [email, setEmail] = useState(currentEmail);
  const [emailFieldError, setEmailFieldError] = useState<string | null>(null);

  const handleEmailSave = async () => {
    await authClient.changeEmail(
      { newEmail: email },
      {
        onError: (ctx) => {
          setEmailFieldError(ctx.error.message);
        },
        onRequest() {
          setEmailFieldError(null);
        },
        onSuccess: (ctx) => {
          setEmailFieldError(null);
        },
      }
    );
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState<string | null>(null);

  const handlePasswordSave = async () => {
    await authClient.changePassword(
      { currentPassword, newPassword, revokeOtherSessions: true },
      {
        onError: (ctx) => {
          setPasswordFieldError(ctx.error.message);
        },
        onRequest() {
          setPasswordFieldError(null);
        },
        onSuccess: (ctx) => {
          setPasswordFieldError(null);
        },
      }
    );
  };

  return (
    <>
      <SettingsNavbar />
      <main className="mx-auto max-w-prose flex-1 overflow-y-auto px-4 pt-[4.25rem]">
        <SectionContainer showBottomBorder>
          <Card>
            <form onSubmit={(e) => e.preventDefault()}>
              <Fieldset>
                <Legend>Profile information</Legend>
                <Text>Update your name, email, and password.</Text>
                <FieldGroup>
                  <div className="flex items-end gap-2">
                    <Field className="flex-1">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="given-name"
                        inputMode="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        invalid={!!nameFieldError}
                        aria-invalid={!!nameFieldError}
                      />
                      {nameFieldError && <ErrorMessage>{nameFieldError}</ErrorMessage>}
                    </Field>
                    <Button color="rose" type="button" onClick={handleNameSave} disabled={name === currentName}>
                      Save
                    </Button>
                  </div>
                  <Divider />
                  <div className="flex items-end gap-2">
                    <Field className="flex-1">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        name="email"
                        autoComplete="email"
                        inputMode="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        invalid={!!emailFieldError}
                        aria-invalid={!!emailFieldError}
                      />
                      {emailFieldError && <ErrorMessage>{emailFieldError}</ErrorMessage>}
                    </Field>
                    <Button color="rose" type="button" onClick={handleEmailSave} disabled={email === currentEmail}>
                      Save
                    </Button>
                  </div>
                  <Divider />
                  <Field className="flex-1">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      name="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      invalid={!!passwordFieldError}
                      aria-invalid={!!passwordFieldError}
                    />
                  </Field>
                  <Field className="flex-1">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      name="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      invalid={!!passwordFieldError}
                      aria-invalid={!!passwordFieldError}
                    />
                    {passwordFieldError && <ErrorMessage>{passwordFieldError}</ErrorMessage>}
                  </Field>
                  <DialogActions>
                    <Button color="rose" type="button" onClick={handlePasswordSave} disabled={!currentPassword || !newPassword}>
                      Update password
                    </Button>
                  </DialogActions>
                </FieldGroup>
              </Fieldset>
            </form>
          </Card>
        </SectionContainer>
        <SectionContainer showBottomBorder>
          <Card>This is card text.</Card>
        </SectionContainer>
        <SectionContainer showBottomBorder={false}>
          <Card>This is card text.</Card>
        </SectionContainer>
      </main>
    </>
  );
}
