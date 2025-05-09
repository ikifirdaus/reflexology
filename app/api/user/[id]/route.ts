import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters long" }),
  email: z.string().min(1, { message: "Must be 1 or more characters long" }),
  role: z.enum(["ADMIN", "USER", "SUPERADMIN"]),
  branchId: z.string().min(1, { message: "Please select a branch" }),
});

type FormValues = z.infer<typeof formSchema>;

export async function PATCH(request: Request) {
  try {
    const body: FormValues = await request.json();
    const validateData = formSchema.parse(body);

    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        name: validateData.name,
        email: validateData.email,
        role: validateData.role,
        branchId: parseInt(validateData.branchId),
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "User deleted successfully" });
}
