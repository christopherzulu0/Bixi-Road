import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client/client";

type MinerProfileProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity: number;
  purity_grade: string | null;
  country: string;
  image_urls: string[];
  seller: {
    full_name: string;
    country: string;
  };
  is_featured: boolean;
  status: string;
  views: number;
};

type MinerProfileReview = {
  id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  product_quality: number | null;
  communication: number | null;
  shipping_speed: number | null;
  created_date: string;
};

type MinerProfile = {
  id: string;
  full_name: string;
  country: string;
  mine_location: string | null;
  bio: string | null;
  rating_average: number;
  total_reviews: number;
  total_sales: number;
  products: MinerProfileProduct[];
  reviews: MinerProfileReview[];
};

type MinerProfileResponse = {
  data: MinerProfile;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Miner ID is required" }, { status: 400 });
    }

    // Fetch miner profile
    const miner = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        country: true,
        bio: true,
        isVerifiedMiner: true,
        sellerApplications: {
          where: {
            status: $Enums.SellerApplicationStatus.APPROVED,
          },
          select: {
            mineLocation: true,
          },
          take: 1,
        },
        productListings: {
          where: {
            isActive: true,
            status: {
              in: [$Enums.ListingStatus.LIVE, $Enums.ListingStatus.APPROVED],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            pricePerUnit: true,
            unit: true,
            quantity: true,
            purityGrade: true,
            country: true,
            imageUrls: true,
            views: true,
            status: true,
          },
        },
      },
    });

    if (!miner) {
      return NextResponse.json({ error: "Miner not found" }, { status: 404 });
    }

    if (!miner.isVerifiedMiner) {
      return NextResponse.json({ error: "User is not a verified miner" }, { status: 403 });
    }

    const fullName = [miner.firstName, miner.lastName].filter(Boolean).join(" ");
    const mineLocation = miner.sellerApplications[0]?.mineLocation || null;

    // Calculate stats
    const soldListings = await prisma.productListing.count({
      where: {
        sellerId: id,
        status: $Enums.ListingStatus.SOLD,
      },
    });

    // Format products for ProductCard
    const products: MinerProfileProduct[] = miner.productListings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category.toString(),
      price_per_unit: listing.pricePerUnit,
      unit: listing.unit.toString().toLowerCase(),
      quantity: listing.quantity,
      purity_grade: listing.purityGrade,
      country: listing.country,
      image_urls: listing.imageUrls || [],
      seller: {
        full_name: fullName,
        country: miner.country || "",
      },
      is_featured: false, // Can be updated if featured field exists
      status: listing.status.toString().toLowerCase(),
      views: listing.views || 0,
    }));

    // Reviews - placeholder since there's no reviews model yet
    const reviews: MinerProfileReview[] = [];

    const profile: MinerProfile = {
      id: miner.id,
      full_name: fullName,
      country: miner.country || "",
      mine_location: mineLocation,
      bio: miner.bio,
      rating_average: 0, // Will be updated when reviews are implemented
      total_reviews: 0, // Will be updated when reviews are implemented
      total_sales: soldListings,
      products,
      reviews,
    };

    const response: MinerProfileResponse = {
      data: profile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[MINER_PROFILE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch miner profile" },
      { status: 500 }
    );
  }
}

