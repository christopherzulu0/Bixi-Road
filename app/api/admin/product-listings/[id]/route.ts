import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing listing id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const action = (body?.action as string | undefined)?.toLowerCase();

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    await prisma.productListing.update({
      where: { id },
      data: { status: newStatus, approvedAt: newStatus === "APPROVED" ? new Date() : null },
    });

    return NextResponse.json({ success: true, data: { id, status: newStatus } });
  } catch (error) {
    console.error("PATCH /api/admin/product-listings/[id] error", error);
    return NextResponse.json({ error: "Failed to update product listing" }, { status: 500 });
  }
}