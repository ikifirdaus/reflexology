import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function extractPublicId(imageUrl: string) {
  const match = imageUrl.match(/\/therapists\/([^/.]+)/);
  return match ? `therapists/${match[1]}` : null;
}

function extractQRCodePublicId(imageUrl: string) {
  const match = imageUrl.match(/\/qrcode\/([^/.]+)/);
  return match ? `qrcode/${match[1]}` : null;
}

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
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "Image size must be less than 2MB." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      const uploadRes = await cloudinary.uploader.upload(dataUrl, {
        folder: "therapists",
      });

      imageUrl = uploadRes.secure_url;

      // Hapus gambar lama dari Cloudinary
      if (oldImage) {
        const publicId = extractPublicId(oldImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("Gagal hapus gambar lama di Cloudinary:", err);
          }
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

    await prisma.therapist.delete({ where: { id } });

    // Hapus foto profil dari Cloudinary
    if (therapist.image) {
      const publicId = extractPublicId(therapist.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Gagal hapus foto profil di Cloudinary:", err);
        }
      }
    }

    // Hapus QR code dari Cloudinary atau lokal
    if (therapist.qrCodeUrl) {
      if (therapist.qrCodeUrl.includes("cloudinary.com")) {
        const qrPublicId = extractQRCodePublicId(therapist.qrCodeUrl);
        if (qrPublicId) {
          try {
            await cloudinary.uploader.destroy(qrPublicId);
          } catch (err) {
            console.warn("Gagal hapus QR code di Cloudinary:", err);
          }
        }
      } else {
        const qrPath = `${process.cwd()}/public/qrcode/${therapist.qrCodeUrl}`;
        try {
          await import("fs/promises").then((fs) => fs.unlink(qrPath));
        } catch (err) {
          console.warn("Gagal hapus QR code lokal:", err);
        }
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
