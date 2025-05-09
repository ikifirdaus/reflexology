"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Input } from "../Input/Input";
import { Branch } from "@/types/branch";
import { useState } from "react";
import { Toast } from "../Toast/Toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

type BranchFormProps = {
  branch?: Branch;
};

export default function BranchForm({ branch }: BranchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: branch
      ? {
          name: branch.name,
        }
      : undefined,
    resolver: zodResolver(formSchema),
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true); // set loading true

    try {
      let response;
      if (branch) {
        response = await fetch(`/api/branch/${branch.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`/api/branch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        setToast({ message: "Branch saved successfully!", type: "success" });
        setTimeout(() => {
          router.push("/admin/branch"); // Redirect to the branchs page after 2 seconds
        }, 2000);
      } else {
        setToast({ message: "Failed to save branch.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "An error occurred.", type: "error" });
    } finally {
      setIsSubmitting(false); // reset loading state
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
            Nama Branch<sup className="text-red-500">*</sup>
          </label>
          <Input {...register("name")} placeholder="Enter name" id="name" />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <ButtonSubmit type="submit" isLoading={isSubmitting}>
          Submit
        </ButtonSubmit>
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
