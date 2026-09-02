import { NextRequest, NextResponse } from "next/server";
import { sendMetaServerEvent, MetaServerEventParams } from "@/lib/metaCapi";

export async function POST(req: NextRequest) {
  try {
    const body: MetaServerEventParams = await req.json();

    // Extract client IP and user-agent from headers if not provided
    const clientIp =
      body.userData?.clientIp ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    const userAgent =
      body.userData?.userAgent || req.headers.get("user-agent") || undefined;

    const eventSourceUrl =
      body.eventSourceUrl || req.headers.get("referer") || undefined;

    const res = await sendMetaServerEvent({
      ...body,
      eventSourceUrl,
      userData: {
        ...body.userData,
        clientIp,
        userAgent,
      },
    });

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
