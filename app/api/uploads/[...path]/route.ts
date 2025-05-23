// app/api/uploads/[...path]/route.ts
import { NextRequest } from "next/server";
import path from "path";
// import fs from "fs";
import { promises as fsPromises } from "fs";

export async function GET(
  req: NextRequest,
  context: { params: { path?: string[] } }
) {
  // const { params } = await contextPromise;
  // const paths = params.path;
  const paths = context.params.path;

  if (!paths || paths.length === 0) {
    return new Response("Path not specified", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", ...paths);

  try {
    await fsPromises.access(filePath);
    const fileBuffer = await fsPromises.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const contentType =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".png"
        ? "image/png"
        : "application/octet-stream";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return new Response("File not found", { status: 404 });
  }
}
