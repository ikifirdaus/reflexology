import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type WhereFilter = {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  branchId?: number;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const branchIdString = formData.get("branchId") as string;
    const file = formData.get("image");

    if (!name || !branchIdString || !file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const branchId = Number(branchIdString);
    if (isNaN(branchId)) {
      return NextResponse.json(
        { error: "Branch ID must be a number." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image size must be less than 10MB." },
        { status: 400 }
      );
    }

    // Simpan foto ke /public/therapist
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${randomUUID()}.jpg`;
    const therapistImagePath = path.join(
      process.cwd(),
      "public",
      "therapist",
      filename
    );
    await writeFile(therapistImagePath, buffer);
    const imageUrl = `/therapist/${filename}`;

    // Simpan data therapist dulu
    const newTherapist = await prisma.therapist.create({
      data: {
        name,
        image: imageUrl,
        branch: {
          connect: { id: branchId },
        },
      },
    });

    // Generate QR code dan simpan ke /public/qrcode
    const feedbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/feedback/${newTherapist.id}`;
    const qrDataUrl = await QRCode.toDataURL(feedbackUrl, {
      width: 500,
      margin: 2,
    });

    const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");
    const qrFileName = `${newTherapist.id}.png`;
    const qrCodePath = path.join(process.cwd(), "public", "qrcode", qrFileName);
    await writeFile(qrCodePath, qrBuffer);
    const qrCodeUrl = `/qrcode/${qrFileName}`;

    // Update therapist dengan QR Code URL
    await prisma.therapist.update({
      where: { id: newTherapist.id },
      data: {
        qrCodeUrl,
      },
    });

    return NextResponse.json(
      {
        ...newTherapist,
        image: imageUrl,
        qrCodeUrl,
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

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, branchId } = token as { role: string; branchId?: number };

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

    // 🔒 Jika admin, batasi ke branch-nya
    if (role === "ADMIN" && branchId) {
      where.branchId = branchId;
    }

    if (where.createdAt && Object.keys(where.createdAt).length === 0) {
      delete where.createdAt;
    }

    let therapists = await prisma.therapist.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        branch: true, // ← tambahkan ini
      },
    });

    if (query) {
      const lowerQuery = query.toLowerCase();
      therapists = therapists.filter((therapist) => {
        const name = therapist.name ?? "";
        // const branch = therapist.branch ?? "";
        const image = therapist.image ?? "";
        const qrCodeUrl = therapist.qrCodeUrl ?? "";

        return (
          name.toLowerCase().includes(lowerQuery) ||
          // branch.toLowerCase().includes(lowerQuery) ||
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
