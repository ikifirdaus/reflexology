import { prisma } from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Folder penyimpanan gambar
const uploadDir = join(process.cwd(), "public/profilePhoto");

const qrDir = join(process.cwd(), "public/qrcode");

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const therapistId = url.pathname.split("/").pop();

    if (!therapistId) {
      return NextResponse.json(
        { error: "Therapist ID is required" },
        { status: 400 }
      );
    }

    const id = Number(therapistId);
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const branch = formData.get("branch") as string;
    const file = formData.get("image") as File | null;
    const oldImage = formData.get("oldImage") as string | null;

    let imageUrl: string | undefined;

    if (file && typeof file !== "string") {
      // Validasi ukuran maksimal 2MB
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "Image size must be less than 2MB." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop();
      const fileName = `${randomUUID()}.${ext}`;
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = fileName;

      // Hapus gambar lama
      if (oldImage) {
        const oldPath = join(uploadDir, oldImage);
        try {
          await unlink(oldPath);
        } catch (err) {
          console.warn("Gagal hapus gambar lama:", err);
        }
      }
    }

    const updatedTherapist = await prisma.therapist.update({
      where: { id },
      data: {
        name,
        branch,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(updatedTherapist, { status: 200 });
  } catch (error) {
    console.error("Error updating therapist:", error);
    return NextResponse.json(
      { error: "Failed to update therapist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const therapistId = url.pathname.split("/").pop();

    if (!therapistId) {
      return NextResponse.json(
        { error: "Therapist ID is required" },
        { status: 400 }
      );
    }

    const id = Number(therapistId);

    // Ambil data untuk mengetahui file yang akan dihapus
    const therapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    // Hapus data dari DB
    await prisma.therapist.delete({ where: { id } });

    // Hapus gambar profil
    if (therapist.image) {
      const imagePath = join(uploadDir, therapist.image);
      try {
        await unlink(imagePath);
      } catch (err) {
        console.warn("Gagal hapus foto profil:", err);
      }
    }

    // Hapus QR code
    if (therapist.qrCodeUrl) {
      const qrPath = join(qrDir, therapist.qrCodeUrl);
      try {
        await unlink(qrPath);
      } catch (err) {
        console.warn("Gagal hapus QR code:", err);
      }
    }

    return NextResponse.json(
      { message: "Therapist deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting therapist:", error);
    return NextResponse.json(
      { error: "Failed to delete therapist" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const therapist = await prisma.therapist.findUnique({
    where: { id: Number(params.id) },
    select: { name: true, image: true },
  });

  if (!therapist) {
    return new Response("Therapist not found", { status: 404 });
  }

  // Pastikan image URL dikembalikan dengan benar
  const therapistWithImage = {
    ...therapist,
    imageUrl: therapist.image ? `/profilePhoto/${therapist.image}` : null,
  };

  return NextResponse.json(therapistWithImage);
}
