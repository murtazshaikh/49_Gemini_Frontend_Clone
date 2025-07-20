"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setTheme = useThemeStore((s) => s.set);

  useEffect(() => {
    const stored = localStorage.getItem("dark-mode");
    const isDark = stored === "true";
    setTheme(isDark);
  }, [setTheme]);

  return (
    <html>
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
