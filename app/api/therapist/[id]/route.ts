import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const therapistId = segments[segments.length - 1];

    if (!therapistId) {
      return NextResponse.json(
        { error: "Therapist ID is required" },
        { status: 400 }
      );
    }

    const id = Number(therapistId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid therapist ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const branchIdRaw = formData.get("branchId");
    const file = formData.get("image");
    const oldImage = formData.get("oldImage");

    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    const branchId = Number(branchIdRaw);
    if (isNaN(branchId)) {
      return NextResponse.json({ error: "Invalid branch ID" }, { status: 400 });
    }

    let imageUrl: string | undefined;

    // Handle file upload
    if (file && file instanceof File && file.size > 0) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "Image size must be less than 10MB." },
          { status: 400 }
        );
      }

      // Validasi tipe file (seperti di POST)
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uuid = randomUUID();
      const fileName = `${uuid}.jpg`; // Sama seperti di POST
      const uploadDir = path.join(process.cwd(), "uploads", "therapist");
      const uploadPath = path.join(uploadDir, fileName);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(uploadPath, buffer);

      imageUrl = `/uploads/therapist/${fileName}`;

      // Hapus gambar lama jika ada dan valid
      // Hapus gambar lama jika ada dan valid
      if (typeof oldImage === "string" && oldImage.length > 0) {
        // Hilangkan slash awal jika ada
        const cleanedOldImage = oldImage.startsWith("/")
          ? oldImage.slice(1)
          : oldImage;

        const oldImagePath = path.join(process.cwd(), cleanedOldImage);

        try {
          await fs.unlink(oldImagePath);
        } catch (err: any) {
          if (err.code !== "ENOENT") {
            console.warn("Gagal hapus foto lama:", err);
          }
        }
      }
    }

    const updatedTherapist = await prisma.therapist.update({
      where: { id },
      data: {
        name: name.trim(),
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
      imageUrl: therapist.image
        ? therapist.image.startsWith("http")
          ? therapist.image
          : `/api${therapist.image}`
        : null,
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
