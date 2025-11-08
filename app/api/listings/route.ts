import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to map category display names to enum values
function mapCategoryToEnum(category: string): string {
  const categoryMap: Record<string, string> = {
    "Gold": "GOLD",
    "Diamond": "DIAMOND",
    "Emerald": "EMERALD",
    "Ruby": "RUBY",
    "Sapphire": "SAPPHIRE",
    "Copper": "COPPER",
    "Lithium": "LITHIUM",
    "Cobalt": "COBALT",
    "Coltan": "COLTAN",
    "Uranium": "URANIUM",
    "Iron Ore": "IRON_ORE",
    "Bauxite": "BAUXITE",
    "Other Gemstone": "OTHER_GEMSTONE",
    "Other Mineral": "OTHER_MINERAL",
  };
  return categoryMap[category] || "OTHER_MINERAL";
}

// Helper function to map unit display names to enum values
function mapUnitToEnum(unit: string): string {
  const unitMap: Record<string, string> = {
    "grams": "GRAMS",
    "kilograms": "KILOGRAMS",
    "tonnes": "TONNES",
    "carats": "CARATS",
    "pieces": "PIECES",
  };
  return unitMap[unit] || "GRAMS";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    // Check if user is a verified miner/seller
    if (user.role !== "MINER" && user.role !== "SELLER" && user.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden - Only verified miners/sellers can create listings",
        }),
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      category,
      description,
      imageUrls,
      quantity,
      unit,
      purityGrade,
      pricePerUnit,
      country,
      region,
      shippingDetails,
    } = body;

    // Validate required fields
    if (!title || !category || !description || !quantity || !pricePerUnit || !country) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // Validate image URLs
    if (!imageUrls || imageUrls.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: "At least one product image is required",
        }),
        { status: 400 }
      );
    }

    // Map category and unit to enum values
    const categoryEnum = mapCategoryToEnum(category);
    const unitEnum = mapUnitToEnum(unit);

    // Create product listing
    const listing = await prisma.productListing.create({
      data: {
        title,
        category: categoryEnum as any,
        description,
        imageUrls: imageUrls || [],
        quantity: parseFloat(quantity),
        unit: unitEnum as any,
        purityGrade: purityGrade || null,
        pricePerUnit: parseFloat(pricePerUnit),
        country,
        region: region || null,
        shippingDetails: shippingDetails || null,
        status: "PENDING_REVIEW",
        sellerId: user.id,
      },
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

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("[LISTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const sellerId = searchParams.get("sellerId");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    const listings = await prisma.productListing.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

