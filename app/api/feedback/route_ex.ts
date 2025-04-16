import { prisma } from "@/lib/prisma";
import { FeedbackSchema } from "@/lib/validation/feedback";
import { NextResponse } from "next/server";
import { Rating } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    // Cek apakah customer sudah ada
    const existingCustomer = await prisma.customer.findUnique({
      where: { contact },
    });

    // Gunakan jika sudah ada, kalau tidak buat baru
    const customer =
      existingCustomer ||
      (await prisma.customer.create({
        data: {
          name,
          contact,
        },
      }));

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

    console.log("Final feedback values:", {
      cleanliness: numberToRating(cleanliness),
      politeness: numberToRating(politeness),
      pressure: numberToRating(pressure),
      punctuality: numberToRating(punctuality),
      result: totalScore,
    });

    console.log("Data ke DB:", {
      therapistId: parseInt(therapistId),
      customerId: customer.id,
      cleanliness: numberToRating(cleanliness),
      politeness: numberToRating(politeness),
      pressure: numberToRating(pressure),
      punctuality: numberToRating(punctuality),
      result: totalScore,
    });

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
  } catch (error: any) {
    console.error("Error saving feedback:", error?.message || error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan feedback." },
      { status: 500 }
    );
  }
}
