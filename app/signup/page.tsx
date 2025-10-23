"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

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
  const { login, setLoading, setError, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain at least one uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear global error
    if (error) {
      setError(null);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post("/api/auth/signup", {
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Update auth state and redirect
      login(token, user);
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
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
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
            value={formData.name}
            onValueChange={(value: string) => handleInputChange("name", value)}
            onKeyPress={handleKeyPress}
            isInvalid={!!validationErrors.name}
            errorMessage={validationErrors.name}
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
            onValueChange={(value: string) => handleInputChange("email", value)}
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

          {error && (
            <div className="text-danger text-sm text-center bg-danger-50 dark:bg-danger-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

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
              <Link href="/login" size="sm" className="font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
