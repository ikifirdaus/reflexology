"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image component from next/image

import { Input } from "../Input/Input";
import { ButtonSubmit } from "../Button/ButtonSubmit";
import { Toast } from "../Toast/Toast";
import { Therapist } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  branchId: z.string().min(1, { message: "Please select a branch" }),
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
    therapist?.image ?? null
  );

  const [branchs, setBranchs] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    console.log("Therapist branchId:", therapist?.branchId);
    const fetchBranchs = async () => {
      const res = await fetch("/api/branch");
      const data = await res.json();
      setBranchs(data.branchs || []);
    };
    fetchBranchs();
  }, [therapist]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: therapist
      ? {
          name: therapist.name,
          branchId: therapist.branchId?.toString() || "",
        }
      : undefined,
  });

  useEffect(() => {
    if (therapist && branchs.length > 0) {
      reset({
        name: therapist.name,
        // image: therapist.image,
        branchId: therapist.branchId?.toString() || "",
      });
    }
  }, [therapist, branchs, reset]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("branchId", data.branchId);
    if (data.image && data.image.length > 0)
      formData.append("image", data.image[0]);

    if (therapist?.image && data.image?.length > 0) {
      if (therapist.image && data.image?.length > 0) {
        formData.append("oldImage", therapist.image); // kirim URL lengkap
      }
    }

    const method = therapist ? "PATCH" : "POST";
    const url = therapist ? `/api/therapist/${therapist.id}` : "/api/therapist";

    setIsSubmitting(true); // set loading true
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
    } finally {
      setIsSubmitting(false); // reset loading state
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
          <label htmlFor="branchId">
            Branch<sup className="text-red-500">*</sup>
          </label>
          <select
            {...register("branchId")}
            id="branchId"
            className="border rounded p-2"
          >
            <option value="">Select a branch</option>
            {branchs.map((branch) => (
              <option key={branch.id} value={branch.id.toString()}>
                {branch.name}
              </option>
            ))}
          </select>

          {errors.branchId && (
            <span className="text-red-500 text-sm">
              {errors.branchId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="image">
            Profile Image{" "}
            <span className="text-sm text-slate-400">
              (Ukuran Foto 3x4, max tidak lebih dari 2MB)
            </span>
          </label>
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
            <Image
              src={previewUrl}
              alt="Preview"
              width={300} // set width and height for the image
              height={200}
              priority
              className="mt-2 object-cover rounded-sm border"
            />
          )}
        </div>

        <ButtonSubmit type="submit" isLoading={isSubmitting}>
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
