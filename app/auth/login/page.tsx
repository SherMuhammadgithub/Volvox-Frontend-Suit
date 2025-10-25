"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
// Simple eye icons as SVG components
const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

import { useAuthStore } from "@/store/authStore";
import { loginApi } from "@/api/auth";
import { loginSchema, LoginForm } from "@/store/validation";
import { ZodIssue } from "zod";
import { addToast } from "@heroui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = () => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      (result.error.issues || []).forEach((err: ZodIssue) => {
        if (typeof err.path[0] === "string") {
          errors[err.path[0] as "email" | "password"] = err.message;
        }
      });
      setValidationErrors(errors);
      return false;
    }
    setValidationErrors({});
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { access_token, user } = await loginApi(
        formData.email,
        formData.password
      );
      login(access_token, user);

      addToast({
        title: "Login successful",
        description: "You have been logged in successfully.",
        color: "success",
      });
      router.push("/dashboard");
    } catch (err: any) {
      addToast({
        title: "Login failed",
        description: err.message || "Please try again.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section: only visible on large screens */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[50%] bg-primary text-primary-foreground px-12 rounded-r-3xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">VOLVOX</h1>
        <h2 className="text-2xl font-bold mb-2">WELCOME BACK!</h2>
        <p className="text-lg font-medium text-primary-foreground/80 text-center max-w-md">
          SIGN IN TO CONTINUE USING SITE FEATURES
        </p>

        <p className="font-caligraphy text-xl text-center text-primary-foreground/90 max-w-lg mt-2">
          <span className="block mb-1 relative">
            <span className="bg-gradient-to-r from-primary-foreground/80 via-primary-foreground/40 to-primary-foreground/80 bg-clip-text text-transparent font-bold">
              Volvox is your personal AI assistant for researchers.
            </span>
          </span>
          <span className="block mb-1 relative">
            <span className="font-semibold text-primary-foreground/90">
              Automate repetitive tasks and enjoy seamless voice control.
            </span>
          </span>
          <span className="block relative">
            <span className="font-semibold text-primary-foreground/80">
              Empower your research with smart automation and intuitive
              interaction.
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1/3 h-0.5 bg-gradient-to-r from-primary-foreground/40 to-primary-foreground/80 rounded-full opacity-60"></span>
          </span>
        </p>
      </div>
      {/* Right section: form */}
      <div
        className="flex-1 flex items-center justify-center bg-background px-4
      "
      >
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-small text-default-500">
                Sign in to your account
              </p>
            </div>
          </CardHeader>

          <CardBody className="gap-4">
            <Button
              color="default"
              size="lg"
              className="w-full font-semibold flex items-center justify-center gap-2 border border-default-300 mb-2"
              variant="bordered"
              onPress={() => {
                /* TODO: Add Google sign-in logic */
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.24-1.39 3.65-5.27 3.65-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.72 1.43l2.54-2.47C17.13 3.99 15.3 3 13.18 3 7.98 3 3.73 7.03 3.73 12s4.25 9 9.45 9c5.44 0 9.04-3.81 9.04-9.16 0-.62-.07-1.09-.17-1.74z" />
              </svg>
              Sign in with Google
            </Button>
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={formData.email}
              onValueChange={(value: string) =>
                handleInputChange("email", value)
              }
              onKeyPress={handleKeyPress}
              isInvalid={!!validationErrors.email}
              errorMessage={validationErrors.email}
              classNames={{
                input: "text-sm",
                label: "text-sm",
              }}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              value={formData.password}
              onValueChange={(value: string) =>
                handleInputChange("password", value)
              }
              onKeyPress={handleKeyPress}
              isInvalid={!!validationErrors.password}
              errorMessage={validationErrors.password}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                input: "text-sm",
                label: "text-sm",
              }}
            />

            <Button
              color="primary"
              size="lg"
              className="w-full font-semibold"
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Divider className="my-2" />

            <div className="text-center">
              <p className="text-sm text-default-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  size="sm"
                  className="font-semibold text-sm text-default-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
