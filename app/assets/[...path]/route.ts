import path from "node:path";
import { promises as fs } from "node:fs";

export const runtime = "nodejs";

const assetsRoot = path.join(process.cwd(), "assets");

const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

const safeResolve = (segments: string[]) => {
  const filePath = path.join(assetsRoot, ...segments);
  const normalizedRoot = path.resolve(assetsRoot);
  const normalizedFile = path.resolve(filePath);

  if (!normalizedFile.startsWith(normalizedRoot)) {
    return null;
  }

  return normalizedFile;
};

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const resolved = safeResolve(segments);

  if (!resolved) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(resolved);
    const extension = path.extname(resolved).toLowerCase();
    const contentType = mimeByExt[extension] ?? "application/octet-stream";

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
