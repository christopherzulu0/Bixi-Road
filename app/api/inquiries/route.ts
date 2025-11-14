import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client";
import { sendInquiryNotificationEmail } from "@/lib/email";

type CreateInquiryRequest = {
  productId: string;
  message: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get buyer from database
    const buyer = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body: CreateInquiryRequest = await req.json();
    const { productId, message } = body;

    if (!productId || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Product ID and message are required" },
        { status: 400 }
      );
    }

    // Get product and seller info
    const product = await prisma.productListing.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if buyer is the seller (can't inquire on own product)
    if (buyer.id === product.sellerId) {
      return NextResponse.json(
        { error: "You cannot send an inquiry on your own product" },
        { status: 400 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        productId: product.id,
        buyerId: buyer.id,
        sellerId: product.sellerId,
        message: message.trim(),
        status: $Enums.InquiryStatus.PENDING,
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

    // Send email notification to seller
    if (product.seller.email) {
      const sellerName = [product.seller.firstName, product.seller.lastName]
        .filter(Boolean)
        .join(" ") || "Seller";
      const buyerName = [buyer.firstName, buyer.lastName]
        .filter(Boolean)
        .join(" ") || buyer.email;

      await sendInquiryNotificationEmail({
        sellerEmail: product.seller.email,
        sellerName,
        buyerName,
        productTitle: product.title,
        message: message.trim(),
        productId: product.id,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: inquiry.id,
        message: inquiry.message,
        status: inquiry.status,
        created_at: inquiry.createdAt,
      },
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("[INQUIRY_POST]", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}

