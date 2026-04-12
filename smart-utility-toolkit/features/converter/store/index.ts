import { create } from 'zustand';

export interface HistoryItem {
  id: string;
  category: string;
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  timestamp: number;
}

interface ConverterState {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  history: [],
  addHistory: (item) =>
    set((state) => ({
      history: [
        { ...item, id: String(Date.now()), timestamp: Date.now() },
        ...state.history,
      ].slice(0, 20),
    })),
  clearHistory: () => set({ history: [] }),
}));
