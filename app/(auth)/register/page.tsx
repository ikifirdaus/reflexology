"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { InputAuth } from "@/components/dashboard/ui/Input/InputAuth";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    branchId: z.string().min(1, "Please select a branch"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branchs, setBranchs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBranchs = async () => {
      const res = await fetch("/api/branch");
      const data = await res.json();
      setBranchs(data.branchs);
    };
    fetchBranchs();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Something went wrong");
      setIsLoading(false);
      return;
    }

    router.push("/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#C26728]">
      <div className="bg-white/90 w-full max-w-md p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Register your account
        </h1>

        {error && (
          <p className="text-red-500 bg-red-100 rounded p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name<sup className="text-red-500">*</sup>
            </label>
            <InputAuth
              type="text"
              placeholder="ex: John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              Cabang<sup className="text-red-500">*</sup>
            </label>
            <select
              {...register("branchId")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Pilih Cabang</option>
              {branchs.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.branchId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.branchId.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Password<sup className="text-red-500">*</sup>
            </label>
            <InputAuth
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Confirm Password<sup className="text-red-500">*</sup>
            </label>
            <InputAuth
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
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
            {isLoading && (
              <div className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            )}
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-2 text-center text-sm">
          <Link href="/" className="text-gray-500 hover:underline">
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
