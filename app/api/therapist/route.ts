import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import cloudinary from "@/lib/cloudinary";

type WhereFilter = {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const branch = formData.get("branch") as string;
    const file = formData.get("image");

    if (!name || !branch || !file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image size must be less than 2MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "therapist" }, (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          })
          .end(buffer);
      }
    );

    const newTherapist = await prisma.therapist.create({
      data: {
        name,
        branch,
        image: uploadResult.secure_url,
      },
    });

    const feedbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/feedback/${newTherapist.id}`;
    const qrDataUrl = await QRCode.toDataURL(feedbackUrl, {
      width: 500,
      margin: 2,
    });
    const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

    const qrUploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "qrcode" }, (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          })
          .end(qrBuffer);
      }
    );

    await prisma.therapist.update({
      where: { id: newTherapist.id },
      data: {
        qrCodeUrl: qrUploadResult.secure_url,
      },
    });

    return NextResponse.json(
      {
        ...newTherapist,
        image: uploadResult.secure_url,
        qrCodeUrl: qrUploadResult.secure_url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating therapist:", error);
    return NextResponse.json(
      { error: "Failed to create therapist" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "10");
    const query = searchParams.get("query")?.trim() || "";
    const fromDate = searchParams.get("fromDate")?.trim();
    const toDate = searchParams.get("toDate")?.trim();

    const where: WhereFilter = {};

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    if (where.createdAt && Object.keys(where.createdAt).length === 0) {
      delete where.createdAt;
    }

    let therapists = await prisma.therapist.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (query) {
      const lowerQuery = query.toLowerCase();
      therapists = therapists.filter((therapist) => {
        const name = therapist.name ?? "";
        const branch = therapist.branch ?? "";
        const image = therapist.image ?? "";
        const qrCodeUrl = therapist.qrCodeUrl ?? "";

        return (
          name.toLowerCase().includes(lowerQuery) ||
          branch.toLowerCase().includes(lowerQuery) ||
          image.toLowerCase().includes(lowerQuery) ||
          qrCodeUrl.toLowerCase().includes(lowerQuery)
        );
      });
    }

    const totalItems = therapists.length;

    const paginatedTherapists = therapists.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({ therapists: paginatedTherapists, totalItems });
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
