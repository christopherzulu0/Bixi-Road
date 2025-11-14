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

    // Fetch inquiries for this seller
    const inquiries = await prisma.inquiry.findMany({
      where: { sellerId: dbUser.id },
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedInquiries = inquiries.map((inquiry) => ({
      id: inquiry.id,
      productTitle: inquiry.product.title,
      buyerName: [inquiry.buyer.firstName, inquiry.buyer.lastName]
        .filter(Boolean)
        .join(" ") || "Unknown Buyer",
      message: inquiry.message,
      status: inquiry.status.toLowerCase(),
      response: inquiry.response,
      createdAt: inquiry.createdAt.toISOString(),
    }));

    const totalInquiries = inquiries.length;
    const pendingInquiries = inquiries.filter(
      (i) => i.status === $Enums.InquiryStatus.PENDING
    ).length;

    return NextResponse.json({
      data: {
        user: userProfile,
        stats: {
          totalListings,
          activeListings,
          totalViews,
          totalInquiries,
          pendingInquiries,
          totalSales,
          totalRevenue,
          pendingTransactions,
        },
        products,
        inquiries: formattedInquiries,
        transactions: [],
      },
    });
  } catch (error) {
    console.error("GET /api/miner/dashboard error", error);
    return NextResponse.json({ error: "Failed to fetch miner dashboard" }, { status: 500 });
  }
}

