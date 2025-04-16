"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Input } from "../Input/Input";
import { Treatment } from "@/types/treatment";
import { useState } from "react";
import { Toast } from "../Toast/Toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters long" }),
  price: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

type TreatmentFormProps = {
  treatment?: Treatment;
};

export default function TreatmentForm({ treatment }: TreatmentFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: treatment
      ? {
          name: treatment.name,
          price: treatment.price,
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
      if (treatment) {
        response = await fetch(`/api/treatment/${treatment.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`/api/treatment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        setToast({ message: "Treatment saved successfully!", type: "success" });
        setTimeout(() => {
          router.push("/admin/treatment"); // Redirect to the treatments page after 2 seconds
        }, 2000);
      } else {
        setToast({ message: "Failed to save treatment.", type: "error" });
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
            Nama Treatment<sup className="text-red-500">*</sup>
          </label>
          <Input
            {...register("name")}
            placeholder="Enter nama treatment"
            id="name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="price">
            Harga<sup className="text-red-500">*</sup>
          </label>
          <Input
            {...register("price", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="Enter harga"
            id="price"
            type="number"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
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
