import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client/client";

type CountResult = { count: bigint | number };

const extractCount = (result: CountResult[] | undefined) => {
  const value = result?.[0]?.count ?? 0;
  return typeof value === "bigint" ? Number(value) : Number(value);
};

export async function GET() {
  try {
    const [
      totalUsers,
      verifiedMinersRaw,
      pendingVerifications,
      totalListings,
      activeListings,
      pendingListings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.$queryRaw<CountResult[]>`
        SELECT COUNT(*)::BIGINT as count
        FROM "users"
        WHERE "is_verified_miner" = TRUE
      `,
      prisma.sellerApplication.count({ where: { status: $Enums.SellerApplicationStatus.PENDING } }),
      prisma.productListing.count(),
      prisma.productListing.count({ where: { isActive: true } }),
      prisma.productListing.count({ where: { status: $Enums.ListingStatus.PENDING_REVIEW } }),
    ]);

    const verifiedMiners = extractCount(verifiedMinersRaw);

    return NextResponse.json({
      data: {
        totalUsers,
        verifiedMiners,
        pendingVerifications,
        totalListings,
        activeListings,
        pendingListings,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard-stats error", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}

