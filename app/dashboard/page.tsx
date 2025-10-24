"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    // Initialize auth state when component mounts
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Show loading state while auth is initializing
  //   if (!isAuthenticated || !user) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  //           <p className="text-default-500">Loading...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="flex flex-col justify-center  w-full p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard!</h1>
        <p className="text-default-500">
          Manage your account and explore features
        </p>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader className="flex gap-3">
          <Avatar
            size="lg"
            name="Sher Muhammad"
            showFallback
            className="text-large"
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Sher Muhammad</p>
            <p className="text-small text-default-500">@</p>
          </div>
          <div className="ml-auto">
            <Chip color="success" variant="flat">
              Active
            </Chip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-default-500 mb-1">User ID</p>
              <p className="font-mono text-sm">PID1010</p>
            </div>
            <div>
              <p className="text-sm text-default-500 mb-1">Account Status</p>
              <Chip size="sm" color="success" variant="flat">
                Verified
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              color="primary"
              variant="flat"
              className="h-20 flex-col"
              startContent={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            >
              <span className="text-sm">Edit Profile</span>
            </Button>

            <Button
              color="secondary"
              variant="flat"
              className="h-20 flex-col"
              startContent={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            >
              <span className="text-sm">Settings</span>
            </Button>

            <Button
              color="warning"
              variant="flat"
              className="h-20 flex-col"
              startContent={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            >
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-default-50 dark:bg-default-100 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Account created successfully
                </p>
                <p className="text-xs text-default-500">
                  Welcome to the platform!
                </p>
              </div>
              <p className="text-xs text-default-400">Just now</p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-default-50 dark:bg-default-100 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profile setup completed</p>
                <p className="text-xs text-default-500">
                  Your profile is now ready
                </p>
              </div>
              <p className="text-xs text-default-400">2 min ago</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Logout Button */}
      <div className="flex justify-center pt-6">
        <Button
          color="danger"
          variant="light"
          onPress={handleLogout}
          startContent={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          }
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
