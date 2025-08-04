
import { useCallback, useRef, MouseEvent, TouchEvent } from 'react';

interface LongPressOptions {
  shouldPreventDefault?: boolean;
  delay?: number;
}

const useLongPress = (
  onLongPress: (event: MouseEvent | TouchEvent) => void,
  onClick: (event: MouseEvent | TouchEvent) => void,
  { shouldPreventDefault = true, delay = 300 }: LongPressOptions = {}
) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = useRef<EventTarget | null>(null);

  const isTouchEvent = (e: Event): e is globalThis.TouchEvent => {
    return "touches" in e;
  };

  const preventDefault = useCallback((e: Event) => {
      if (!isTouchEvent(e)) return;

      if (e.touches.length < 2 && e.preventDefault) {
          e.preventDefault();
      }
  }, []);

  const start = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, { passive: false });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault, preventDefault]
  );

  const clear = useCallback(
    (event: MouseEvent | TouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
          clearTimeout(timeout.current);
          if (shouldTriggerClick) onClick(event);
      }
      
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault as EventListener);
      }
    },
    [shouldPreventDefault, onClick, preventDefault]
  );

  return {
    onMouseDown: (e: MouseEvent) => start(e),
    onTouchStart: (e: TouchEvent) => start(e),
    onMouseUp: (e: MouseEvent) => clear(e),
    onMouseLeave: (e: MouseEvent) => clear(e, false),
    onTouchEnd: (e: TouchEvent) => clear(e),
  };
};

export default useLongPress;