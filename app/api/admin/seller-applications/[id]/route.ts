import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/src/generated/prisma/client";
import { $Enums } from "@/src/generated/prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const action = (body?.action as string | undefined)?.toLowerCase();

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }

    const application = await prisma.sellerApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: "Seller application not found" }, { status: 404 });
    }

    if (application.status !== $Enums.SellerApplicationStatus.PENDING) {
      return NextResponse.json(
        { error: "Application has already been processed" },
        { status: 409 }
      );
    }

    const newStatus =
      action === "approve"
        ? $Enums.SellerApplicationStatus.APPROVED
        : $Enums.SellerApplicationStatus.REJECTED;

    const updated = await prisma.$transaction(async (tx) => {
      const statusUpdated = await tx.sellerApplication.update({
        where: { id },
        data: { status: newStatus },
      });

      if (newStatus === $Enums.SellerApplicationStatus.APPROVED) {
        const userUpdateData: Prisma.UserUpdateInput = {
          role: { set: $Enums.Role.seller },
        };

        await tx.user.update({
          where: { id: statusUpdated.userId },
          data: userUpdateData,
        });

        await tx.$executeRaw`
          UPDATE "users"
          SET "is_verified_miner" = TRUE
          WHERE "id" = ${statusUpdated.userId}
        `;
      }

      return statusUpdated;
    });

    return NextResponse.json({ success: true, data: { id, status: updated.status } });
  } catch (error) {
    console.error("PATCH /api/admin/seller-applications/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update application", details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}