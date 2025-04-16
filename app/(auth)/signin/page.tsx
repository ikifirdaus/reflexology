"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/dashboard/ui/Input/Input";
import Link from "next/link";

// Skema validasi dengan Zod
const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Tipe data dari schema
type SignInFormData = z.infer<typeof signinSchema>;

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/admin/feedbackCustomer");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Sign in to your account</h1>
        {error && (
          <p className="text-red-500 bg-red-200 rounded p-2 mb-2 text-center">
            {error}
          </p>
        )}
        <hr className="mb-2" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
              <p className="text-red-500 text-sm">{errors.email.message}</p>
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
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <hr className="mb-2" />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign In
          </button>
        </form>

        <div className="mt-2 text-center">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-primary">
              <span className="text-blue-500 hover:text-blue-600">
                Register
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
