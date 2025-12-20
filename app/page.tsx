"use client";


import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { useAuthStore } from "@/store/authStore";

const LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URL || "";
const USE_CUSTOM_LOGOUT = process.env.NEXT_PUBLIC_USE_CUSTOM_LOGOUT === "true";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for token and user info in URL params
      const token = searchParams.get("token");
      const user_id = searchParams.get("user_id");
      const user_name = searchParams.get("user_name");
      const user_email = searchParams.get("user_email");

      // If any required param is missing, redirect to custom URL if enabled
      if (!(token && user_id && user_email)) {
        if (USE_CUSTOM_LOGOUT) {
          window.location.href = LOGOUT_URL;
        } else {
          router.replace("/auth/login");
        }
        return;
      }

      // All params present: set auth and redirect
      const authState = {
        state: {
          token,
          user: {
            id: user_id,
            name: user_name,
            email: user_email,
          },
        },
      };
      sessionStorage.setItem("auth-storage", JSON.stringify(authState));
      router.replace("/dashboard");
      return;
    }
  }, [router, searchParams]);

  // Show a loading state while checking authentication
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" color="primary" />
    </section>
  );
}
