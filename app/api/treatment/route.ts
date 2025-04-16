import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 5 or more characters long" }),
  price: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

// Definisikan tipe untuk filter where
type WhereFilter = {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
};

export async function POST(request: Request) {
  try {
    const body: FormValues = await request.json();

    const validateData = formSchema.parse(body);

    const newTreatment = await prisma.treatment.create({
      data: {
        name: validateData.name,
        price: validateData.price,
      },
    });
    return NextResponse.json(newTreatment, { status: 201 });
  } catch (error) {
    console.error("Error creating treatment:", error);
    return NextResponse.json(
      { error: "Failed to create treatment" },
      { status: 400 }
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

    const where: WhereFilter = {}; // Menggunakan tipe `WhereFilter` untuk `where`

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
    let treatments = await prisma.treatment.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Filtering di kode
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      treatments = treatments.filter((treatment) => {
        const name = treatment.name || "";
        const price = treatment.price || "";

        return (
          name.toLowerCase().includes(lowerCaseQuery) ||
          price?.toString().toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Hitung total setelah filtering
    const totalItems = treatments.length;

    // Pagination setelah filtering
    const paginatedTreatments = treatments.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({ treatments: paginatedTreatments, totalItems });
  } catch (error) {
    console.error("Error fetching treatment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
