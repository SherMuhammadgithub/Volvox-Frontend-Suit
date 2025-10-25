"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, initializeAuth } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Zustand hydration detection
  useEffect(() => {
    setHasHydrated(useAuthStore.persist?.hasHydrated?.() ?? true);
    // fallback: if persist is not present, assume hydrated
  }, []);

  useEffect(() => {
    // Initialize auth state when component mounts
    initializeAuth();
  }, [initializeAuth]);

  // Redirect to login if not authenticated or no user
  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated && !user) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, hasHydrated]);

  if (!hasHydrated || (!isAuthenticated && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("auth/login");
  };

  return (
    <div className="flex flex-col justify-center  w-full p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Hey {user?.fullName || "Dashboard"} !
        </h1>
        <p className="text-default-500">
          How can we assist you in your research today?
        </p>
      </div>
    </div>
  );
}
