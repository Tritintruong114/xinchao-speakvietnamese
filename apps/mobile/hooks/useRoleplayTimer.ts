import { useState, useEffect } from 'react';
import { useToastStore } from '../store/useToastStore';
import { Dialogue } from '../constants/SurvivalData';

export function useRoleplayTimer(currentDialogue: Dialogue | undefined, onTimeout: (timeoutId: string) => void) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { showToast, hideToast } = useToastStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentDialogue?.timeLimit) {
      setTimeLeft(currentDialogue.timeLimit);
      
      // Show the Hurry Bar Toast
      showToast("HURRY! Respond before the vendor loses patience!", "warning", currentDialogue.timeLimit);

      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            if (currentDialogue.timeoutId) {
              onTimeout(currentDialogue.timeoutId);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(null);
      hideToast();
    }

    return () => {
      if (interval) clearInterval(interval);
      hideToast();
    };
  }, [currentDialogue?.id, currentDialogue?.timeLimit]);

  const resetTimer = () => {
    setTimeLeft(null);
    hideToast();
  };

  return { timeLeft, resetTimer };
}
