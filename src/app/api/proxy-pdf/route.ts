import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");
  const filePath = searchParams.get("path");

  // 1. If a full download URL is passed (has token)
  if (targetUrl) {
    if (!targetUrl.startsWith("https://firebasestorage.googleapis.com/")) {
      return new NextResponse("Invalid URL domain", { status: 400 });
    }

    try {
      const upstream = await fetch(targetUrl, {
        headers: {
          Accept: "application/pdf, application/octet-stream, */*",
        },
      });

      if (!upstream.ok) {
        return new NextResponse(`Storage upstream returned ${upstream.status}`, {
          status: upstream.status,
        });
      }

      const buffer = await upstream.arrayBuffer();
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": buffer.byteLength.toString(),
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    } catch (err: any) {
      console.error("proxy-pdf fetch error:", err);
      return new NextResponse("Failed to proxy PDF: " + (err?.message || err), {
        status: 502,
      });
    }
  }

  // 2. If a storage path is passed (e.g. library/prakticheska-biblia-chast-1/file.pdf)
  if (filePath) {
    try {
      const file = adminStorage().bucket().file(filePath);
      const [contents] = await file.download();
      return new NextResponse(new Uint8Array(contents), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": contents.length.toString(),
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    } catch (adminErr: any) {
      console.error("proxy-pdf adminStorage error:", adminErr);
      return new NextResponse("File download failed: " + (adminErr?.message || adminErr), {
        status: 500,
      });
    }
  }

  return new NextResponse("Missing url or path parameter", { status: 400 });
}
