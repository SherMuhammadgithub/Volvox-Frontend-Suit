"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

import { useAuthStore } from "@/store/authStore";
import { signupApi } from "@/api/auth";
import { signupSchema, SignupForm } from "@/store/validation";
import { ZodIssue } from "zod";

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

export default function SignupPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  const [formData, setFormData] = useState<SignupForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const validateForm = () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const errors: {
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      (result.error.issues || []).forEach((err: ZodIssue) => {
        if (typeof err.path[0] === "string") {
          errors[err.path[0] as keyof typeof errors] = err.message;
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

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { access_token, user } = await signupApi(
        formData.fullName,
        formData.email,
        formData.password
      );
      login(access_token, user);
      router.push("/dashboard");
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSignup();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section: only visible on large screens */}
      <div className="hidden lg:flex w-[50%] min-h-screen items-center justify-center bg-primary text-primary-foreground rounded-r-3xl">
        <div className="flex flex-col justify-center items-center w-full h-full px-12">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            VOLVOX
          </h1>
          <h2 className="text-2xl font-bold mb-2">WELCOME!</h2>
          <p className="text-lg font-medium text-primary-foreground/80 text-center max-w-md mb-4">
            ENTER YOUR PERSONAL DETAILS TO CREATE AN ACCOUNT AND USE ALL OF SITE
            FEATURES
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
      </div>
      {/* Right section: form */}
      <div className="flex-1 flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-small text-default-500">
                Sign up to get started
              </p>
            </div>
          </CardHeader>

          <CardBody className="gap-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              variant="bordered"
              value={formData.fullName}
              onValueChange={(value: string) =>
                handleInputChange("fullName", value)
              }
              onKeyPress={handleKeyPress}
              isInvalid={!!validationErrors.fullName}
              errorMessage={validationErrors.fullName}
              classNames={{
                input: "text-sm",
                label: "text-sm",
              }}
            />

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
              placeholder="Create a password"
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

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              variant="bordered"
              value={formData.confirmPassword}
              onValueChange={(value: string) =>
                handleInputChange("confirmPassword", value)
              }
              onKeyPress={handleKeyPress}
              isInvalid={!!validationErrors.confirmPassword}
              errorMessage={validationErrors.confirmPassword}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirmVisibility}
                >
                  {isConfirmVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              }
              type={isConfirmVisible ? "text" : "password"}
              classNames={{
                input: "text-sm",
                label: "text-sm",
              }}
            />

            <Button
              color="primary"
              size="lg"
              className="w-full font-semibold"
              onPress={handleSignup}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Divider className="my-2" />

            <div className="text-center">
              <p className="text-sm text-default-500">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  size="sm"
                  className="font-semibold text-default-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
