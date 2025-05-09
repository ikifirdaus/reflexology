import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 5 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export async function PATCH(request: Request) {
  try {
    const body: FormValues = await request.json();
    const validateData = formSchema.parse(body);

    const url = new URL(request.url);
    const branchId = url.pathname.split("/").pop();

    if (!branchId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const updateBranch = await prisma.branch.update({
      where: { id: parseInt(branchId) },
      data: {
        name: validateData.name,
      },
    });

    return NextResponse.json(updateBranch, { status: 200 });
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
  await prisma.branch.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "Branch deleted successfully" });
}
