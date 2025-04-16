import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 5 or more characters long" }),
  contact: z.string().min(1, { message: "Must be 5 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export async function PATCH(request: Request) {
  try {
    const body: FormValues = await request.json();
    const validateData = formSchema.parse(body);

    const url = new URL(request.url);
    const customerId = url.pathname.split("/").pop();

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(customerId) },
      data: {
        name: validateData.name,
        contact: validateData.contact,
      },
    });

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.customer.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "Customer deleted successfully" });
}
