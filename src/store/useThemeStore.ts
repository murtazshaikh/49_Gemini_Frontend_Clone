import { create } from "zustand";

type ThemeStore = {
  darkMode: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  darkMode: false,
  toggle: () =>
    set((state) => {
      const newVal = !state.darkMode;
      localStorage.setItem("dark-mode", JSON.stringify(newVal));
      return { darkMode: newVal };
    }),
  set: (value) => {
    localStorage.setItem("dark-mode", JSON.stringify(value));
    set({ darkMode: value });
  },
}));
