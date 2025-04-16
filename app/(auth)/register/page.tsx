"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/dashboard/ui/Input/Input";
import Link from "next/link";

// Skema validasi dengan Zod
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error || "Something went wrong");
      return;
    }

    router.push("/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Register your account!</h1>
        {error && (
          <p className="text-red-500 bg-red-200 rounded p-2 mb-2 text-center">
            {error}
          </p>
        )}
        <hr className="mb-2" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col">
            <label>
              Name<sup className="text-red-500">*</sup>
            </label>
            <Input
              type="text"
              placeholder="ex: John Doe"
              {...register("name")}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors?.name?.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label>
              Email<sup className="text-red-500">*</sup>
            </label>
            <Input
              type="email"
              placeholder="ex: user@example.com"
              {...register("email")}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors?.email?.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label>
              Password<sup className="text-red-500">*</sup>
            </label>
            <Input
              type="password"
              placeholder="********"
              {...register("password")}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors?.password?.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label>
              Confirm Password<sup className="text-red-500">*</sup>
            </label>
            <Input
              type="password"
              placeholder="********"
              {...register("confirmPassword")}
              className="w-full p-2 border rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors?.confirmPassword?.message as string}
              </p>
            )}
          </div>
          <hr className="mb-2" />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>
        <div className="mt-2 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="text-primary">
              <span className="text-blue-500 hover:text-blue-600">Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
