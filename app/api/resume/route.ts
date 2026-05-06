import { NextRequest, NextResponse } from "next/server";

import { getActiveResumeBinary } from "@/lib/cms/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public download endpoint for the active resume.
 *
 *   GET /api/resume                → inline (browser preview)
 *   GET /api/resume?download=1     → forces download
 */
export async function GET(req: NextRequest) {
  const file = await getActiveResumeBinary();
  if (!file) {
    return NextResponse.json(
      { ok: false, error: "Resume not yet uploaded." },
      { status: 404 },
    );
  }

  const wantsDownload = req.nextUrl.searchParams.get("download") === "1";
  const disposition = wantsDownload ? "attachment" : "inline";

  return new NextResponse(file.data, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `${disposition}; filename="${file.filename}"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
