// app/auth/page.tsx
import React from "react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main>
      <h1>Login or Signup</h1>
      <AuthForm />
    </main>
  );
}
