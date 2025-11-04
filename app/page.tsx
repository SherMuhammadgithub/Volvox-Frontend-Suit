"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check for token in Zustand's persisted storage (auth-storage)
    if (typeof window !== "undefined") {
      let token = null;
      try {
        const persisted = sessionStorage.getItem("auth-storage");
        if (persisted) {
          const parsed = JSON.parse(persisted);
          token = parsed.state?.token || parsed.token || null;
        }
      } catch {}
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      } 
    }
  }, [router]);

  // Show a loading state while checking authentication
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" color="primary" />
    </section>
  );
}
