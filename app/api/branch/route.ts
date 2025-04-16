import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const therapists = await prisma.therapist.findMany({
    select: {
      branch: true,
    },
    distinct: ["branch"],
  });

  const branches = therapists.map((t) => t.branch).filter(Boolean);
  return NextResponse.json(branches);
}
