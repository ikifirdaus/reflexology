import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 5 or more characters long" }),
  price: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export async function PATCH(request: Request) {
  try {
    const body: FormValues = await request.json();
    const validateData = formSchema.parse(body);

    const url = new URL(request.url);
    const treatmentId = url.pathname.split("/").pop();

    if (!treatmentId) {
      return NextResponse.json(
        { error: "Treatment ID is required" },
        { status: 400 }
      );
    }

    const updatedTreatment = await prisma.treatment.update({
      where: { id: parseInt(treatmentId) },
      data: {
        name: validateData.name,
        price: validateData.price,
      },
    });

    return NextResponse.json(updatedTreatment, { status: 200 });
  } catch (error) {
    console.error("Error updating treatment:", error);
    return NextResponse.json(
      { error: "Failed to update treatment" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.treatment.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "Treatment deleted successfully" });
}
