import { useState, useEffect } from 'react';
import { magaStore } from '../store/magaStore';

export const useMagaMode = () => {
  const [isMagaMode, setIsMagaMode] = useState(magaStore.get());

  useEffect(() => {
    const unsubscribe = magaStore.subscribe(setIsMagaMode);
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isMagaMode,
    toggleMagaMode: magaStore.toggle,
  };
};
