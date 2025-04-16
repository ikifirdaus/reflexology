import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import QRCode from "qrcode";

const uploadDir = join(process.cwd(), "public/profilePhoto");
const qrDir = join(process.cwd(), "public/qrcode");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const branch = formData.get("branch") as string;
    const file = formData.get("image") as File;

    if (!name || !branch || !file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Validasi ukuran maksimal 2MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image size must be less than 2MB." },
        { status: 400 }
      );
    }

    // Simpan gambar profil
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    // Buat data therapist (tanpa qrCodeUrl dulu)
    const newTherapist = await prisma.therapist.create({
      data: {
        name,
        branch,
        image: fileName,
      },
    });

    // Generate URL feedback berdasarkan ID
    const feedbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/feedback/${newTherapist.id}`;
    const qrCodeFileName = `${newTherapist.id}.png`;
    const qrCodePath = join(qrDir, qrCodeFileName);

    await mkdir(qrDir, { recursive: true });
    await QRCode.toFile(qrCodePath, feedbackUrl, {
      width: 500,
      margin: 2,
    });

    // Update qrCodeUrl di database
    await prisma.therapist.update({
      where: { id: newTherapist.id },
      data: {
        qrCodeUrl: qrCodeFileName,
      },
    });

    return NextResponse.json(
      { ...newTherapist, qrCodeUrl: qrCodeFileName },
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

    const where: any = {};

    // Filter tanggal di Prisma (tetap gunakan database untuk ini)
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    if (where.createdAt && Object.keys(where.createdAt).length === 0) {
      delete where.createdAt;
    }

    // Ambil semua data dulu, lalu filter di kode
    let therapists = await prisma.therapist.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Filtering di kode
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      therapists = therapists.filter((therapist) => {
        const name = therapist.name || "";
        const branch = therapist.branch || "";
        const image = therapist.image || "";
        const qrCodeUrl = therapist.qrCodeUrl || "";

        return (
          name.toLowerCase().includes(lowerCaseQuery) ||
          branch.toLowerCase().includes(lowerCaseQuery) ||
          image.toLowerCase().includes(lowerCaseQuery) ||
          qrCodeUrl.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Hitung total setelah filtering
    const totalItems = therapists.length;

    // Pagination setelah filtering
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
