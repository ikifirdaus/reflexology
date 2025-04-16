"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Input } from "../Input/Input";
import { useState } from "react";
import { Toast } from "../Toast/Toast";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters long" }),
  email: z.string().min(1, { message: "Must be 1 or more characters long" }),
  role: z.enum(["ADMIN", "USER"]),
});

type FormValues = z.infer<typeof formSchema>;

type UserFormProps = {
  user?: User;
};

export default function UserForm({ user }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role as "ADMIN" | "USER", // Ensure that role is either "ADMIN" or "USER"
        }
      : undefined,
    resolver: zodResolver(formSchema),
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  async function onSubmit(data: FormValues) {
    try {
      let response;
      if (user) {
        response = await fetch(`/api/user/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`/api/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        setToast({ message: "User saved successfully!", type: "success" });
        setTimeout(() => {
          router.push("/admin/user"); // Redirect to the users page after 2 seconds
        }, 2000);
      } else {
        setToast({ message: "Failed to save user.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "An error occurred.", type: "error" });
    }
  }

  return (
    <div className="space-y-4 font-medium">
      <form
        className="flex flex-col gap-4 text-slate-500 font-sans"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label htmlFor="name">
            Name<sup className="text-red-500">*</sup>
          </label>
          <Input {...register("name")} placeholder="Enter name" id="name" />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">
            Email<sup className="text-red-500">*</sup>
          </label>
          <Input {...register("email")} placeholder="Enter email" id="email" />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="role">
            Role<sup className="text-red-500">*</sup>
          </label>
          <select
            {...register("role")}
            id="role"
            className="border rounded p-2"
          >
            <option value="">Select a role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          {errors.role && (
            <span className="text-red-500 text-sm">{errors.role.message}</span>
          )}
        </div>

        <ButtonSubmit type="submit">Submit</ButtonSubmit>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
