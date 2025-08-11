'use client';

import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface UseDrawerHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  drawerName?: string;
}

export function useDrawerHistory({ isOpen, onClose, drawerName = 'drawer' }: UseDrawerHistoryProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    // Push a new history state when drawer opens
    const state = { drawer: drawerName, timestamp: Date.now() };
    window.history.pushState(state, '', window.location.href);

    // Handle back button press
    const handlePopState = (event: PopStateEvent) => {
      // Check if we're navigating away from our drawer state
      const currentState = window.history.state;
      if (!currentState || currentState.drawer !== drawerName) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, isMobile, onClose, drawerName]);
}
