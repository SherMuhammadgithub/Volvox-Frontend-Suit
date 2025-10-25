"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();

  // Show a loading state while checking authentication
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" color="primary" />
    </section>
  );
}
