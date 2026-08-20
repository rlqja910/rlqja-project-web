import { useState, useEffect } from 'react';
import { magaStore } from '../store/magaStore';

export const useMagaMode = () => {
  const [isMagaMode, setIsMagaMode] = useState(magaStore.get());

  useEffect(() => {
    return magaStore.subscribe(setIsMagaMode);
  }, []);

  return {
    isMagaMode,
    toggleMagaMode: magaStore.toggle,
  };
};
