"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize authentication state when the app starts
    initializeAuth();
  }, [initializeAuth]);

  // This component doesn't render anything, it just initializes auth state
  return null;
}