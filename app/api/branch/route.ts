import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 5 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export async function POST(request: Request) {
  try {
    const body: FormValues = await request.json();

    const validateData = formSchema.parse(body);

    const newBranch = await prisma.branch.create({
      data: {
        name: validateData.name,
      },
    });
    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
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

    // Tipe data untuk filter tanggal
    interface DateFilter {
      gte?: Date;
      lte?: Date;
    }

    const where: {
      createdAt?: DateFilter;
    } = {};

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
    let branchs = await prisma.branch.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Filtering di kode
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      branchs = branchs.filter((branch) => {
        const name = branch.name || "";

        return name.toLowerCase().includes(lowerCaseQuery);
      });
    }

    // Hitung total setelah filtering
    const totalItems = branchs.length;

    // Pagination setelah filtering
    const paginatedBranchs = branchs.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({ branchs: paginatedBranchs, totalItems });
  } catch (error) {
    console.error("Error fetching branchs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
