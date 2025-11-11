import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type BuyerStats = {
  total: number;
  pending: number;
  completed: number;
  totalSpent: number;
};

type Transaction = {
  id: string;
  transaction_id: string;
  product_title: string;
  seller_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  escrow_status: string;
  buyer_confirmed: boolean;
  created_date: string;
};

type BuyerDashboardResponse = {
  user: {
    id: string;
    full_name: string;
  };
  stats: BuyerStats;
  transactions: Transaction[];
};

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's transactions (future implementation - for now return empty)
    // This would need a Transaction/Order model in your schema
    const transactions: Transaction[] = [];

    // Calculate stats
    const stats: BuyerStats = {
      total: transactions.length,
      pending: transactions.filter((t) => ["funds_held", "shipped"].includes(t.escrow_status)).length,
      completed: transactions.filter((t) => t.escrow_status === "completed").length,
      totalSpent: transactions
        .filter((t) => t.escrow_status === "completed")
        .reduce((sum, t) => sum + (t.total_amount || 0), 0),
    };

    const response: BuyerDashboardResponse = {
      user: {
        id: user.id,
        full_name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      },
      stats,
      transactions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[BUYER_DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch buyer dashboard" },
      { status: 500 }
    );
  }
}

