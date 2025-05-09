"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { InputAuth } from "@/components/dashboard/ui/Input/InputAuth";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signinSchema>;

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/admin/feedbackCustomer");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#C26728]">
      <div className="bg-white/90 w-full max-w-md p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Sign in to your account
        </h1>

        {error && (
          <p className="text-red-500 bg-red-100 rounded p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email<sup className="text-red-500">*</sup>
            </label>
            <InputAuth
              type="email"
              placeholder="ex: user@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password<sup className="text-red-500">*</sup>
            </label>
            <InputAuth
              type="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-[#C26728]/50 cursor-not-allowed"
                : "bg-[#C26728] hover:bg-[#C26728]/80"
            }`}
          >
            {isLoading ? (
              <>
                <div className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
