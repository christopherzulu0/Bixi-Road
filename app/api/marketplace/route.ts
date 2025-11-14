import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type MarketplaceQueryParams = {
  category?: string;
  country?: string;
  search?: string;
  sortBy?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const category = searchParams.get("category") || "all";
    const country = searchParams.get("country") || "all";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "-created_date";

    // Build where clause - include APPROVED and LIVE statuses
    const where: any = {
      isActive: true,
      status: {
        in: ["LIVE", "APPROVED"],
      },
    };

    if (category !== "all") {
      where.category = category;
    }

    if (country !== "all") {
      where.country = country;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    let orderBy: any = { createdAt: "desc" };
    switch (sortBy) {
      case "price_per_unit":
        orderBy = { pricePerUnit: "asc" };
        break;
      case "-price_per_unit":
        orderBy = { pricePerUnit: "desc" };
        break;
      case "-views":
        orderBy = { views: "desc" };
        break;
      case "-created_date":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const listings = await prisma.productListing.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            country: true,
          },
        },
      },
    });

    const formatted = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price_per_unit: listing.pricePerUnit,
      unit: listing.unit,
      quantity: listing.quantity,
      purity_grade: listing.purityGrade,
      country: listing.country,
      image_urls: listing.imageUrls,
      seller: {
        full_name: [listing.seller.firstName, listing.seller.lastName]
          .filter(Boolean)
          .join(" "),
        country: listing.seller.country,
      },
      is_featured: false,
      status: "active",
      views: listing.views,
      created_date: listing.createdAt.toISOString(),
    }));

    console.log("[MARKETPLACE_GET] Returning", formatted.length, "listings");
    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("[MARKETPLACE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace listings", details: String(error) },
      { status: 500 }
    );
  }
}

