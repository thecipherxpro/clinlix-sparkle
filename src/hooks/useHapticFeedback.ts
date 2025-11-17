import { useCallback } from 'react';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((style: HapticStyle = 'light') => {
    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      switch (style) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(30);
          break;
        case 'success':
          navigator.vibrate([10, 20, 10]);
          break;
        case 'warning':
          navigator.vibrate([20, 10, 20]);
          break;
        case 'error':
          navigator.vibrate([30, 20, 30]);
          break;
        default:
          navigator.vibrate(10);
      }
    }

    // iOS Haptic Engine (if available via Capacitor or PWA API)
    if ('HapticFeedback' in window && typeof (window as any).HapticFeedback !== 'undefined') {
      try {
        const haptic = (window as any).HapticFeedback;
        switch (style) {
          case 'light':
            haptic.impact({ style: 'light' });
            break;
          case 'medium':
            haptic.impact({ style: 'medium' });
            break;
          case 'heavy':
            haptic.impact({ style: 'heavy' });
            break;
          case 'success':
            haptic.notification({ type: 'success' });
            break;
          case 'warning':
            haptic.notification({ type: 'warning' });
            break;
          case 'error':
            haptic.notification({ type: 'error' });
            break;
        }
      } catch (error) {
        console.debug('Haptic feedback not available:', error);
      }
    }
  }, []);

  return { triggerHaptic };
};
