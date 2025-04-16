import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Must be 5 or more characters long" }),
  content: z.string().min(1, { message: "Must be 5 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export async function PATCH(request: Request) {
  try {
    const body: FormValues = await request.json();
    const validateData = formSchema.parse(body);

    const url = new URL(request.url);
    const articleId = url.pathname.split("/").pop();

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        title: validateData.title,
        content: validateData.content,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.article.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "Article deleted successfully" });
}
