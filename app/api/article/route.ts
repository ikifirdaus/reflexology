import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Must be 5 or more characters long" }),
  content: z.string().min(1, { message: "Must be 5 or more characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export async function POST(request: Request) {
  try {
    const body: FormValues = await request.json();

    const validateData = formSchema.parse(body);

    const newArticle = await prisma.article.create({
      data: {
        title: validateData.title,
        content: validateData.content,
      },
    });
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "10");
    const query = searchParams.get("query")?.trim() || "";
    const fromDate = searchParams.get("fromDate")?.trim();
    const toDate = searchParams.get("toDate")?.trim();

    const where: any = {};

    // Filter tanggal di Prisma (tetap gunakan database untuk ini)
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    if (where.createdAt && Object.keys(where.createdAt).length === 0) {
      delete where.createdAt;
    }

    // Ambil semua data dulu, lalu filter di kode
    let articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Filtering di kode
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      articles = articles.filter((article) => {
        const title = article.title || "";
        const content = article.content || "";

        return (
          title.toLowerCase().includes(lowerCaseQuery) ||
          content.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Hitung total setelah filtering
    const totalItems = articles.length;

    // Pagination setelah filtering
    const paginatedArticles = articles.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({ articles: paginatedArticles, totalItems });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
