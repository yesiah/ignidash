import { Suspense } from 'react';
import ForgotPasswordForm from './forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-label="Loading forgot password form"
          className="text-muted-foreground flex h-full items-center justify-center text-2xl sm:text-xl"
        >
          Loading<span className="loading-ellipsis" aria-hidden="true"></span>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
