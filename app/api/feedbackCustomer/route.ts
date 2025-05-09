import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type WhereFilter = {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  branchId?: number;
};

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
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    const fromDate = searchParams.get("fromDate")?.trim();
    const toDate = searchParams.get("toDate")?.trim();
    const branchIdParam = searchParams.get("branchId");
    const therapistName = searchParams
      .get("therapistName")
      ?.trim()
      .toLowerCase();

    const where: WhereFilter = {};

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDay;
      }
    }

    if (where.createdAt && Object.keys(where.createdAt).length === 0) {
      delete where.createdAt;
    }

    let feedbacks = await prisma.feedback.findMany({
      where: {
        ...(where.createdAt && { createdAt: where.createdAt }),
        therapist: {
          ...(role === "ADMIN" && branchId
            ? { branchId: branchId }
            : branchIdParam
            ? { branchId: parseInt(branchIdParam) }
            : {}),
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        therapist: {
          select: {
            name: true,
            branchId: true,
            branch: { select: { name: true } },
          },
        },
      },
    });

    // Filtering berdasarkan nama customer, therapist, dan therapistName
    if (query || therapistName) {
      feedbacks = feedbacks.filter((feedback) => {
        const customerName = feedback.customer?.name?.toLowerCase() || "";
        const therapistNameData = feedback.therapist?.name?.toLowerCase() || "";

        const matchQuery = query
          ? customerName.includes(query) || therapistNameData.includes(query)
          : true;

        const matchTherapistName = therapistName
          ? therapistNameData.includes(therapistName)
          : true;

        return matchQuery && matchTherapistName;
      });
    }

    const totalItems = feedbacks.length;
    const paginatedFeedbacks = feedbacks.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({ therapists: paginatedFeedbacks, totalItems });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
