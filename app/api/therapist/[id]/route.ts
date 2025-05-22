import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
    const branchId = Number(formData.get("branchId"));
    const file = formData.get("image") as File | null;
    const oldImage = formData.get("oldImage") as string | null;

    if (isNaN(branchId)) {
      return NextResponse.json({ error: "Invalid branch ID" }, { status: 400 });
    }

    let imageUrl: string | undefined;

    if (file && typeof file !== "string") {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "Image size must be less than 10MB." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), "public/therapist", fileName);

      await fs.writeFile(uploadPath, buffer);

      imageUrl = `/therapist/${fileName}`;

      // Hapus gambar lama
      if (oldImage?.startsWith("/therapist/")) {
        const oldPath = path.join(process.cwd(), "public", oldImage);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err);
        }
      }
    }

    const updatedTherapist = await prisma.therapist.update({
      where: { id },
      data: {
        name,
        branchId,
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

export async function GET(request: Request) {
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

    const therapist = await prisma.therapist.findUnique({
      where: { id },
      select: {
        name: true,
        image: true,
      },
    });

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: therapist.name,
      imageUrl: therapist.image,
    });
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist" },
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

    const therapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    // Hapus gambar profil dari lokal
    if (therapist.image?.startsWith("/therapist/")) {
      const imagePath = path.join(process.cwd(), "public", therapist.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("Gagal hapus foto profil:", err);
      }
    }

    // Hapus QR code dari lokal
    if (therapist.qrCodeUrl?.startsWith("/qrcode/")) {
      const qrPath = path.join(process.cwd(), "public", therapist.qrCodeUrl);
      try {
        await fs.unlink(qrPath);
      } catch (err) {
        console.warn("Gagal hapus QR code:", err);
      }
    }

    await prisma.therapist.delete({ where: { id } });

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
