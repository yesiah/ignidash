'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface UseDrawerHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  drawerName?: string;
}

export function useDrawerHistory({ isOpen, onClose, drawerName = 'drawer' }: UseDrawerHistoryProps) {
  const isMobile = useIsMobile();
  const closedByPopstate = useRef(false);

  const handlePopState = useCallback(
    (event: PopStateEvent) => {
      if (event.state?.drawer === drawerName && !isOpen) {
        return;
      }

      if (isOpen && (!event.state || event.state.drawer !== drawerName)) {
        closedByPopstate.current = true;
        onClose();
      }
    },
    [isOpen, onClose, drawerName]
  );

  useEffect(() => {
    if (!isMobile) return;

    if (isOpen) {
      const state = { drawer: drawerName };
      window.history.pushState(state, '', window.location.href);
      closedByPopstate.current = false;
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Only go back if we pushed a state and the drawer wasn't closed by popstate
      if (isOpen && !closedByPopstate.current && window.history.state?.drawer === drawerName) {
        window.history.back();
      }
    };
  }, [isOpen, isMobile, handlePopState, drawerName]);
}
