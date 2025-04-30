import { prisma } from "@/lib/prisma";
import { FeedbackSchema } from "@/lib/validation/feedback";
import { NextResponse } from "next/server";
import { Rating } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

type FeedbackBody = {
  therapistId: string;
  name: string;
  contact: string;
  cleanliness: number;
  politeness: number;
  pressure: number;
  punctuality: number;
  totalScore: number;
};

export async function POST(req: Request) {
  try {
    const body: FeedbackBody = await req.json();

    const {
      therapistId,
      name,
      contact,
      cleanliness,
      politeness,
      pressure,
      punctuality,
      totalScore,
    } = FeedbackSchema.parse(body);

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // 🔍 Cek apakah customer sudah ada hari ini berdasarkan nama + contact
    let customer = await prisma.customer.findFirst({
      where: {
        // name,
        contact,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // ❌ Jika belum ada, buat customer baru
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          contact,
        },
      });
    }

    // ❌ Cek apakah sudah pernah submit feedback hari ini untuk therapist yang sama
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        customerId: customer.id,
        therapistId: parseInt(therapistId),
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        {
          message:
            "Anda sudah memberikan feedback hari ini. Terima kasih atas partisipasi Anda.",
        },
        { status: 403 }
      );
    }

    // 🔁 Konversi skor ke enum Rating
    const numberToRating = (num: number): Rating => {
      const ratingMap: { [key: number]: Rating } = {
        5: "Sangat_Memuaskan",
        4: "Memuaskan",
        3: "Cukup",
        2: "Tidak_Memuaskan",
        1: "Sangat_Tidak_Memuaskan",
      };
      const result = ratingMap[num];
      if (!result) throw new Error("Invalid rating number");
      return result;
    };

    // ✅ Simpan feedback
    const feedback = await prisma.feedback.create({
      data: {
        therapistId: parseInt(therapistId),
        customerId: customer.id,
        cleanliness: numberToRating(cleanliness),
        politeness: numberToRating(politeness),
        pressure: numberToRating(pressure),
        punctuality: numberToRating(punctuality),
        result: totalScore,
      },
    });

    return NextResponse.json({
      message: "Feedback berhasil disimpan",
      feedback,
    });
  } catch (error) {
    console.error(
      "Error saving feedback:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan feedback." },
      { status: 500 }
    );
  }
}
