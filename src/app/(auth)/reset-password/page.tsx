import { Suspense } from 'react';
import ResetPasswordForm from './reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-label="Loading reset password form"
          className="text-muted-foreground flex h-full items-center justify-center text-2xl sm:text-xl"
        >
          Loading<span className="loading-ellipsis" aria-hidden="true"></span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
