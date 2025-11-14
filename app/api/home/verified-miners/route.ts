import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client";

type VerifiedMiner = {
  id: string;
  full_name: string;
  country: string;
  rating_average: number;
  total_reviews: number;
  total_sales: number;
};

type VerifiedMinersResponse = {
  data: VerifiedMiner[];
};

export async function GET() {
  try {
    // Fetch verified miners
    const verifiedMiners = await prisma.user.findMany({
      where: {
        isVerifiedMiner: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        country: true,
        productListings: {
          where: {
            status: $Enums.ListingStatus.SOLD,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const formatted: VerifiedMiner[] = verifiedMiners.map((miner) => {
      const fullName = [miner.firstName, miner.lastName]
        .filter(Boolean)
        .join(" ");

      // Calculate total sales (count of sold listings)
      const totalSales = miner.productListings.length;

      // Since there's no reviews model yet, we'll set defaults
      // These can be updated when reviews are implemented
      const ratingAverage = 0;
      const totalReviews = 0;

      return {
        id: miner.id,
        full_name: fullName,
        country: miner.country || "",
        rating_average: ratingAverage,
        total_reviews: totalReviews,
        total_sales: totalSales,
      };
    });

    const response: VerifiedMinersResponse = {
      data: formatted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[HOME_VERIFIED_MINERS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch verified miners" },
      { status: 500 }
    );
  }
}

