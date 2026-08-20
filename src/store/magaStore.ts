type Listener = (isMaga: boolean) => void;

let isMagaMode = false;
const listeners = new Set<Listener>();

export const magaStore = {
  get: () => isMagaMode,
  set: (value: boolean) => {
    isMagaMode = value;
    listeners.forEach((l) => l(isMagaMode));
  },
  toggle: () => {
    magaStore.set(!isMagaMode);
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
