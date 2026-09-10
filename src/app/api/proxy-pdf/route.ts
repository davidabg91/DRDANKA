import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const targetUrl = req.nextUrl.searchParams.get("url");

    if (!targetUrl) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return new NextResponse("Invalid url format", { status: 400 });
    }

    // Only proxy Firebase / Google Cloud Storage URLs for security
    const allowedHosts = [
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
    ];

    if (!allowedHosts.includes(parsedUrl.hostname)) {
      return new NextResponse("Forbidden domain", { status: 403 });
    }

    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf, application/octet-stream, */*",
      },
    });

    if (!upstream.ok) {
      return new NextResponse(`Storage returned ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err: any) {
    console.error("proxy-pdf error:", err);
    return new NextResponse("Proxy error: " + (err?.message || String(err)), {
      status: 502,
    });
  }
}
