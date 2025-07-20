import { create } from "zustand";

type AuthState = {
  phone: string;
  countryCode: string;
  isLoggedIn: boolean;
  login: (phone: string, code: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  phone: "",
  countryCode: "",
  isLoggedIn: false,
  login: (phone, code) => {
    set({ phone, countryCode: code, isLoggedIn: true });
    localStorage.setItem("auth", JSON.stringify({ phone, countryCode: code }));
  },
  logout: () => {
    set({ phone: "", countryCode: "", isLoggedIn: false });
    localStorage.removeItem("auth");
  },
}));
