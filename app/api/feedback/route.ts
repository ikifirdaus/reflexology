import { prisma } from "@/lib/prisma";
import { FeedbackSchema } from "@/lib/validation/feedback";
import { NextResponse } from "next/server";
import { Rating } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

// Tipe data untuk body yang diterima dari request
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
    console.log("BODY:", body);

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

    // Cek apakah customer dengan nama dan contact yang sama, terdaftar hari ini
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        name,
        contact,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          message:
            "Data tidak ditemukan. Anda hanya bisa mengisi feedback jika sudah terdaftar hari ini dengan nama dan nomor yang sama.",
        },
        { status: 403 }
      );
    }

    // ✅ Tambahan: Cek apakah sudah pernah mengisi feedback hari ini
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        customerId: existingCustomer.id,
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

    const feedback = await prisma.feedback.create({
      data: {
        therapistId: parseInt(therapistId),
        customerId: existingCustomer.id,
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
