// utils/authRedirect.ts
// Client-side auth redirect helpers for sessionStorage-based auth

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URL || "";
const USE_CUSTOM_LOGOUT = process.env.NEXT_PUBLIC_USE_CUSTOM_LOGOUT === "true";

// Call in protected pages (e.g. dashboard)
export function useRequireAuth() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth-token");
      if (!token) {
        if (USE_CUSTOM_LOGOUT) {
          window.location.href = LOGOUT_URL;
        } else {
          router.replace("/auth/login");
        }
      }
    }
  }, [router]);
}

// Call in login/signup pages to redirect if already logged in
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth-token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);
}
