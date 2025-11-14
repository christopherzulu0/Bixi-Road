import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type Transaction = {
  id: string;
  transaction_id: string;
  product_title: string;
  buyer_name: string;
  seller_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  commission_amount: number;
  seller_receives: number;
  escrow_status: string;
  buyer_confirmed: boolean;
  created_date: string;
};

type TransactionsResponse = {
  data: Transaction[];
};

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all transactions with related data
    const dbTransactions = await prisma.transaction.findMany({
      include: {
        product: {
          select: {
            title: true,
            seller: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        buyer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const transactions: Transaction[] = dbTransactions.map((t) => ({
      id: t.id,
      transaction_id: t.transactionId,
      product_title: t.product.title,
      buyer_name: [t.buyer.firstName, t.buyer.lastName]
        .filter(Boolean)
        .join(" ") || "Unknown Buyer",
      seller_name: [t.product.seller.firstName, t.product.seller.lastName]
        .filter(Boolean)
        .join(" ") || "Unknown Seller",
      quantity: t.quantity,
      unit_price: t.unitPrice,
      total_amount: t.totalAmount,
      commission_amount: t.commissionAmount,
      seller_receives: t.sellerReceives,
      escrow_status: t.escrowStatus.toLowerCase().replace(/_/g, " "),
      buyer_confirmed: t.buyerConfirmed,
      created_date: t.createdAt.toISOString(),
    }));

    const response: TransactionsResponse = {
      data: transactions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[ADMIN_TRANSACTIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

