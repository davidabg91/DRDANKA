import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, adminStorage } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "d.nikolova.haccp@gmail.com";

/**
 * GET /api/courses/{id}/url
 * Returns a 1-hour signed URL for the protected PDF.
 *
 * Auth: caller must send `Authorization: Bearer <firebaseIdToken>`.
 * Authorization: token email must be the admin OR must appear in the user's
 * purchasedCourseIds for this course.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await context.params;

  // Extract bearer token.
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  let email: string;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    if (!decoded.email) {
      return NextResponse.json({ error: "no_email_in_token" }, { status: 401 });
    }
    email = decoded.email.toLowerCase();
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  // Load course.
  const courseSnap = await adminDb().collection("courses").doc(courseId).get();
  if (!courseSnap.exists) {
    return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  }
  const course = courseSnap.data() as { filePath: string };

  // Verify access.
  if (email !== ADMIN_EMAIL) {
    const userSnap = await adminDb().collection("users").doc(email).get();
    const purchased: string[] = userSnap.exists ? (userSnap.data() as any).purchasedCourseIds || [] : [];
    if (!purchased.includes(courseId)) {
      return NextResponse.json({ error: "not_purchased" }, { status: 403 });
    }
  }

  // Issue 1-hour signed URL.
  try {
    const file = adminStorage().bucket().file(course.filePath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    return NextResponse.json({ url, expiresInSeconds: 3600 });
  } catch (err: any) {
    console.error("Signed URL error:", err);
    return NextResponse.json({ error: "signed_url_failed", detail: err?.message }, { status: 500 });
  }
}
