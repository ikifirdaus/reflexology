"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "../Input/Input";
import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Toast } from "../Toast/Toast";
import { Therapist } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  branch: z.string().min(1, { message: "Branch is required" }),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type TherapistFormProps = {
  therapist?: Therapist;
};

export default function TherapistForm({ therapist }: TherapistFormProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    therapist?.image ? `/profilePhoto/${therapist.image}` : null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: therapist
      ? {
          name: therapist.name,
          branch: therapist.branch,
          // qrCodeUrl: therapist.qrCodeUrl || "",
        }
      : undefined,
  });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("branch", data.branch);
    // if (data.qrCodeUrl) formData.append("qrCodeUrl", data.qrCodeUrl);
    if (data.image && data.image.length > 0)
      formData.append("image", data.image[0]);

    if (therapist?.image && data.image?.length > 0) {
      const oldFileName = therapist.image.split("/").pop(); // Ambil nama file lama
      if (oldFileName) formData.append("oldImage", oldFileName);
    }

    const method = therapist ? "PATCH" : "POST";
    const url = therapist ? `/api/therapist/${therapist.id}` : "/api/therapist";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setToast({
          message: `Therapist ${
            therapist ? "updated" : "created"
          } successfully!`,
          type: "success",
        });
        setTimeout(() => {
          router.push("/admin/therapist");
        }, 2000);
      } else {
        setToast({ message: "Failed to submit data.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong.", type: "error" });
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 text-slate-600 font-sans"
      >
        <div className="flex flex-col">
          <label htmlFor="name">
            Name <sup className="text-red-500">*</sup>
          </label>
          <Input
            {...register("name")}
            id="name"
            placeholder="Enter therapist name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="branch">
            Branch <sup className="text-red-500">*</sup>
          </label>
          <Input
            {...register("branch")}
            id="branch"
            placeholder="Enter branch"
          />
          {errors.branch && (
            <span className="text-red-500 text-sm">
              {errors.branch.message}
            </span>
          )}
        </div>

        {/* <div className="flex flex-col">
          <label htmlFor="qrCodeUrl">QR Code URL</label>
          <Input
            {...register("qrCodeUrl")}
            id="qrCodeUrl"
            placeholder="Enter QR code URL"
          />
        </div> */}

        <div className="flex flex-col">
          <label htmlFor="image">Profile Image</label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            {...register("image")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              register("image").onChange(e);
              onImageChange(e);
            }}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full border"
            />
          )}
        </div>

        <ButtonSubmit type="submit">
          {therapist ? "Update" : "Create"}
        </ButtonSubmit>
        <div className="flex flex-col text-center text-sm text-slate-500">
          QRCODE akan otomatis di generate ketika data telah di create dan tidak
          berubah ketika data di ubah
        </div>
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
