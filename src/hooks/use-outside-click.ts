import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hook to detect clicks inside or outside a referenced element
 *
 * Similar to useOutsideClick but provides both inside and outside detection.
 * Useful for charts that need to track interaction state.
 *
 * @param onOutside - Function to call when a click occurs outside the element
 * @param onInside - Function to call when a click occurs inside the element
 * @returns RefObject to attach to the target element
 */
export function useClickDetection<T extends HTMLElement = HTMLDivElement>(
  onOutside: () => void,
  onInside: () => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;

    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      if (!element) return;

      if (element.contains(event.target as Node)) {
        onInside();
      } else {
        onOutside();
      }
    };

    document.addEventListener('mousedown', handleInteraction);
    document.addEventListener('touchend', handleInteraction);

    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
    };
  }, [onOutside, onInside]);

  return ref;
}
