import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters long" }),
  email: z.string().min(1, { message: "Must be 1 or more characters long" }),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
  role: z.enum(["ADMIN", "USER"]),
});

type FormValues = z.infer<typeof formSchema>;

export async function POST(request: Request) {
  try {
    const body: FormValues = await request.json();

    const validateData = formSchema.parse(body);

    const newUser = await prisma.user.create({
      data: {
        name: validateData.name,
        email: validateData.email,
        role: validateData.role,
        password: validateData.password,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
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
    let users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Filtering di kode
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      users = users.filter((user) => {
        const name = user.name || "";
        const email = user.email || "";
        const role = user.role || "";

        return (
          name.toLowerCase().includes(lowerCaseQuery) ||
          email.toLowerCase().includes(lowerCaseQuery) ||
          role.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Hitung total setelah filtering
    const totalItems = users.length;

    // Pagination setelah filtering
    const paginatedUsers = users.slice((page - 1) * perPage, page * perPage);

    return NextResponse.json({ users: paginatedUsers, totalItems });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
