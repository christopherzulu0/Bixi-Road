import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type RespondToInquiryRequest = {
  response: string;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get seller from database
    const seller = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
      },
    });

    if (!seller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await context.params;
    const body: RespondToInquiryRequest = await req.json();
    const { response } = body;

    if (!response || !response.trim()) {
      return NextResponse.json(
        { error: "Response message is required" },
        { status: 400 }
      );
    }

    // Get inquiry and verify seller owns the product
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            sellerId: true,
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Verify the seller owns the product
    if (inquiry.product.sellerId !== seller.id) {
      return NextResponse.json(
        { error: "Unauthorized - you can only respond to inquiries on your own products" },
        { status: 403 }
      );
    }

    // Update inquiry with response
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        response: response.trim(),
        status: $Enums.InquiryStatus.RESPONDED,
        respondedAt: new Date(),
      },
      include: {
        product: {
          select: {
            title: true,
          },
        },
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedInquiry.id,
        response: updatedInquiry.response,
        status: updatedInquiry.status,
        respondedAt: updatedInquiry.respondedAt,
      },
      message: "Response sent successfully",
    });
  } catch (error) {
    console.error("[INQUIRY_RESPOND_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to respond to inquiry" },
      { status: 500 }
    );
  }
}

