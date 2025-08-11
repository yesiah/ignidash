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

    const state = { drawer: drawerName, timestamp: Date.now() };
    window.history.pushState(state, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      const currentState = window.history.state;
      if (!currentState || currentState.drawer !== drawerName) {
        setTimeout(onClose, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, isMobile, onClose, drawerName]);
}
