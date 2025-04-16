import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Tipe untuk where filter pada Prisma
type WhereFilter = {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "10");
    const query = searchParams.get("query")?.trim() || "";
    const fromDate = searchParams.get("fromDate")?.trim();
    const toDate = searchParams.get("toDate")?.trim();
    const therapistName = searchParams
      .get("therapistName")
      ?.trim()
      .toLowerCase();

    const where: WhereFilter = {}; // Menggunakan tipe `WhereFilter` untuk `where`

    // Filter tanggal di Prisma (tetap gunakan database untuk ini)
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999); // <-- ini penting
        where.createdAt.lte = endOfDay;
      }
    }

    if (where.createdAt && Object.keys(where.createdAt).length === 0) {
      delete where.createdAt;
    }

    // Ambil semua data dulu, lalu filter di kode
    let feedbacks = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true },
        },
        therapist: {
          select: { name: true },
        },
      },
    });

    // Filtering di kode
    if (query || therapistName) {
      feedbacks = feedbacks.filter((feedback) => {
        const customer = feedback.customer || { name: "" };
        const therapist = feedback.therapist || { name: "" };

        const matchQuery = query
          ? customer.name.toLowerCase().includes(query.toLowerCase()) ||
            therapist.name.toLowerCase().includes(query.toLowerCase())
          : true;

        const matchTherapist = therapistName
          ? therapist.name.toLowerCase().includes(therapistName)
          : true;

        return matchQuery && matchTherapist;
      });
    }

    // Hitung total setelah filtering
    const totalItems = feedbacks.length;

    // Pagination setelah filtering
    const paginatedFeedbacks = feedbacks.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({ therapists: paginatedFeedbacks, totalItems });
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
