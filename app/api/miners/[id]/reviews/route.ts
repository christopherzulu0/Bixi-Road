import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ReviewRequest = {
  rating: number;
  comment: string;
  product_quality?: number;
  communication?: number;
  shipping_speed?: number;
  transaction_id?: string;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sellerId } = await context.params;
    const body: ReviewRequest = await req.json();

    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID is required" }, { status: 400 });
    }

    // Validate rating
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate optional ratings
    if (body.product_quality && (body.product_quality < 1 || body.product_quality > 5)) {
      return NextResponse.json(
        { error: "Product quality rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (body.communication && (body.communication < 1 || body.communication > 5)) {
      return NextResponse.json(
        { error: "Communication rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (body.shipping_speed && (body.shipping_speed < 1 || body.shipping_speed > 5)) {
      return NextResponse.json(
        { error: "Shipping speed rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get buyer user
    const buyer = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    // Check if seller exists and is verified
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { id: true, isVerifiedMiner: true },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    if (!seller.isVerifiedMiner) {
      return NextResponse.json(
        { error: "Seller is not a verified miner" },
        { status: 403 }
      );
    }

    // Prevent self-review
    if (buyer.id === sellerId) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      );
    }

    // Check if buyer already reviewed this seller (optional - you might want to allow multiple reviews)
    // For now, we'll allow multiple reviews

    // Create review
    const review = await prisma.review.create({
      data: {
        sellerId,
        buyerId: buyer.id,
        rating: body.rating,
        comment: body.comment,
        productQuality: body.product_quality || null,
        communication: body.communication || null,
        shippingSpeed: body.shipping_speed || null,
        transactionId: body.transaction_id || null,
      },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const buyerName = [review.buyer.firstName, review.buyer.lastName]
      .filter(Boolean)
      .join(" ");

    return NextResponse.json({
      data: {
        id: review.id,
        buyer_name: buyerName,
        rating: review.rating,
        comment: review.comment,
        product_quality: review.productQuality,
        communication: review.communication,
        shipping_speed: review.shippingSpeed,
        created_date: review.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[MINER_REVIEW_POST]", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

