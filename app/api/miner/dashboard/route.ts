import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { $Enums } from "@/src/generated/prisma/client";

const pendingTransactionStatuses: $Enums.ListingStatus[] = [
  $Enums.ListingStatus.PENDING_REVIEW,
  $Enums.ListingStatus.SHIPPED_TO_HUB,
  $Enums.ListingStatus.VERIFIED,
];

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        country: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const productListings = await prisma.productListing.findMany({
      where: { sellerId: dbUser.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        pricePerUnit: true,
        unit: true,
        quantity: true,
        views: true,
        imageUrls: true,
        isActive: true,
        approvedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalListings = productListings.length;
    const activeListings = productListings.filter((listing) => listing.isActive).length;
    const totalViews = productListings.reduce((sum, listing) => sum + (listing.views ?? 0), 0);
    const totalSales = productListings.filter(
      (listing) => listing.status === $Enums.ListingStatus.SOLD
    ).length;
    const totalRevenue = productListings
      .filter((listing) => listing.status === $Enums.ListingStatus.SOLD)
      .reduce((sum, listing) => sum + listing.pricePerUnit * listing.quantity, 0);
    const pendingTransactions = productListings.filter((listing) =>
      pendingTransactionStatuses.includes(listing.status)
    ).length;

    const userProfile = {
      id: dbUser.id,
      fullName: [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") || "Account",
      country: dbUser.country ?? null,
      ratingAverage: null,
      totalReviews: 0,
      totalSales,
    };

    const products = productListings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      status: listing.status.toLowerCase(),
      pricePerUnit: listing.pricePerUnit,
      unit: listing.unit.toLowerCase(),
      quantity: listing.quantity,
      views: listing.views ?? 0,
      imageUrls: listing.imageUrls ?? [],
      isActive: listing.isActive,
      approvedAt: listing.approvedAt,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    }));

    return NextResponse.json({
      data: {
        user: userProfile,
        stats: {
          totalListings,
          activeListings,
          totalViews,
          totalInquiries: 0,
          totalSales,
          totalRevenue,
          pendingTransactions,
        },
        products,
        inquiries: [],
        transactions: [],
      },
    });
  } catch (error) {
    console.error("GET /api/miner/dashboard error", error);
    return NextResponse.json({ error: "Failed to fetch miner dashboard" }, { status: 500 });
  }
}

