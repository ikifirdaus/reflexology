"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Input } from "../Input/Input";
import { Customer } from "@/types/customer";
import Textarea from "../TextArea/Textarea";
import { useState } from "react";
import { Toast } from "../Toast/Toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters long" }),
  contact: z.string().min(1, { message: "Must be 1 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

type CustomerFormProps = {
  customer?: Customer;
};

export default function CustomerForm({ customer }: CustomerFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: customer
      ? {
          name: customer.name,
          contact: customer.contact,
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
      if (customer) {
        response = await fetch(`/api/customer/${customer.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`/api/customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        setToast({ message: "Customer saved successfully!", type: "success" });
        setTimeout(() => {
          router.push("/admin/customer"); // Redirect to the articles page after 2 seconds
        }, 2000);
      } else {
        setToast({ message: "Failed to save article.", type: "error" });
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
            Nama Customer<sup className="text-red-500">*</sup>
          </label>
          <Input {...register("name")} placeholder="Enter name" id="name" />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="contact">
            Contact<sup className="text-red-500">*</sup>
          </label>
          <Input
            {...register("contact")}
            placeholder="Enter contact"
            id="contact"
          />
          {errors.contact && (
            <span className="text-red-500 text-sm">
              {errors.contact.message}
            </span>
          )}
        </div>

        {/* <div className="flex flex-col">
          <label htmlFor="contact">
            Contact<sup className="text-red-500">*</sup>
          </label>
          <Textarea {...register("contact")} id="contact" rows="4" />
          {errors.contact && (
            <span className="text-red-500 text-sm">
              {errors.contact.message}
            </span>
          )}
        </div> */}

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
