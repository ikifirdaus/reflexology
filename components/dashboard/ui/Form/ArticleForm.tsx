"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Input } from "../Input/Input";
import { Article } from "@/types/article";
import Textarea from "../TextArea/Textarea";
import { useState } from "react";
import { Toast } from "../Toast/Toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, { message: "Must be 1 or more characters long" }),
  content: z.string().min(1, { message: "Must be 1 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

type ArticleFormProps = {
  article?: Article;
};

export default function ArticleForm({ article }: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: article
      ? {
          title: article.title,
          content: article.content,
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
      if (article) {
        response = await fetch(`/api/article/${article.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`/api/article`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        setToast({ message: "Article saved successfully!", type: "success" });
        setTimeout(() => {
          router.push("/admin/article"); // Redirect to the articles page after 2 seconds
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
          <label htmlFor="title">
            Title<sup className="text-red-500">*</sup>
          </label>
          <Input {...register("title")} placeholder="Enter title" id="title" />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="content">
            Content<sup className="text-red-500">*</sup>
          </label>
          <Textarea {...register("content")} id="content" rows="4" />
          {errors.content && (
            <span className="text-red-500 text-sm">
              {errors.content.message}
            </span>
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
