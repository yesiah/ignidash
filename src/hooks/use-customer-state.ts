import { useState, useEffect, useCallback } from 'react';

import { authClient } from '@/lib/auth-client';

type CustomerState = {
  id: string;
};

export function useCustomerState() {
  const [customerState, setCustomerState] = useState<CustomerState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    authClient.customer
      .state()
      .then(({ data, error: apiError }) => {
        if (!mounted) return;

        if (apiError) {
          setError(new Error(apiError.message));
          setCustomerState(null);
        } else {
          setCustomerState(data);
        }
      })
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, [refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return { customerState, isLoading, error, refetch };
}
