"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth-token");
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [router]);

  // Show a loading state while checking authentication
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-screen">
      <Card className="max-w-md">
        <CardBody className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h1 className={title({ size: "sm" })}>Welcome</h1>
            <p className={subtitle({ class: "mt-2" })}>
              Redirecting you to the right place...
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              as={Link}
              href="/auth/login"
              color="primary"
              variant="flat"
              size="sm"
            >
              Login
            </Button>
            <Button
              as={Link}
              href="/auth/signup"
              color="secondary"
              variant="flat"
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
