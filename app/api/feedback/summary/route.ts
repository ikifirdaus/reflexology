import { startOfMonth, endOfMonth } from "date-fns";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const branch = searchParams.get("branch");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "10", 10);

  if (!month) {
    return NextResponse.json({ error: "Month is required" }, { status: 400 });
  }

  const start = startOfMonth(new Date(`${month}-01`));
  const end = endOfMonth(new Date(`${month}-01`));

  const feedbacks = await prisma.feedback.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      therapist: branch ? { branch } : undefined,
    },
    include: {
      therapist: true,
    },
    skip: (page - 1) * perPage, // Skip records based on page
    take: perPage, // Limit the records to perPage
  });

  const totalItems = await prisma.feedback.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      therapist: branch ? { branch } : undefined,
    },
  });

  const summaryMap = new Map<number, { therapist: any; totalResult: number }>();

  for (const feedback of feedbacks) {
    const { therapistId, result, therapist } = feedback;
    if (!therapist) continue;

    if (!summaryMap.has(therapistId)) {
      summaryMap.set(therapistId, {
        therapist,
        totalResult: result || 0,
      });
    } else {
      const entry = summaryMap.get(therapistId)!;
      entry.totalResult += result || 0;
    }
  }

  const summary = Array.from(summaryMap.values());

  return NextResponse.json({
    items: summary,
    totalItems,
  });
}
