import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client";

type PurchaseRequest = {
  productId: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const buyer = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body: PurchaseRequest = await req.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Product ID and valid quantity are required" },
        { status: 400 }
      );
    }

    // Get product listing
    const product = await prisma.productListing.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product is available
    if (!product.isActive || product.status !== $Enums.ListingStatus.LIVE) {
      return NextResponse.json(
        { error: "Product is not available for purchase" },
        { status: 400 }
      );
    }

    // Check if quantity is available
    if (quantity > product.quantity) {
      return NextResponse.json(
        { error: `Only ${product.quantity} ${product.unit.toLowerCase()} available` },
        { status: 400 }
      );
    }

    // Calculate amounts
    const totalAmount = quantity * product.pricePerUnit;
    const commissionRate = 0.075; // 7.5% commission
    const commissionAmount = totalAmount * commissionRate;
    const sellerReceives = totalAmount - commissionAmount;

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create transaction and update product in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          transactionId,
          productId: product.id,
          buyerId: buyer.id,
          sellerId: product.sellerId,
          quantity,
          unitPrice: product.pricePerUnit,
          totalAmount,
          commissionRate,
          commissionAmount,
          sellerReceives,
          escrowStatus: $Enums.EscrowStatus.FUNDS_HELD,
          buyerConfirmed: false,
        },
      });

      // Update product quantity
      const newQuantity = product.quantity - quantity;
      await tx.productListing.update({
        where: { id: product.id },
        data: {
          quantity: newQuantity,
          // Mark as SOLD if quantity reaches 0
          status: newQuantity === 0 ? $Enums.ListingStatus.SOLD : product.status,
          isActive: newQuantity > 0,
        },
      });

      return transaction;
    });

    return NextResponse.json({
      success: true,
      data: {
        transactionId: result.transactionId,
        productTitle: product.title,
        quantity,
        totalAmount,
        escrowStatus: result.escrowStatus,
      },
      message: "Purchase completed successfully. Funds are held in escrow.",
    });
  } catch (error) {
    console.error("[PURCHASE_POST]", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}

