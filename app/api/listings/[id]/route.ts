import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function mapCategoryToEnum(category: string): string {
  const categoryMap: Record<string, string> = {
    Gold: "GOLD",
    Diamond: "DIAMOND",
    Emerald: "EMERALD",
    Ruby: "RUBY",
    Sapphire: "SAPPHIRE",
    Copper: "COPPER",
    Lithium: "LITHIUM",
    Cobalt: "COBALT",
    Coltan: "COLTAN",
    Uranium: "URANIUM",
    "Iron Ore": "IRON_ORE",
    Bauxite: "BAUXITE",
    "Other Gemstone": "OTHER_GEMSTONE",
    "Other Mineral": "OTHER_MINERAL",
  };
  return categoryMap[category] || "OTHER_MINERAL";
}

function mapUnitToEnum(unit: string): string {
  const unitMap: Record<string, string> = {
    grams: "GRAMS",
    kilograms: "KILOGRAMS",
    tonnes: "TONNES",
    carats: "CARATS",
    pieces: "PIECES",
  };
  return unitMap[unit] || "GRAMS";
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const listing = await prisma.productListing.findUnique({
      where: { id },
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

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Only show active/approved listings publicly
    if (!listing.isActive || (listing.status !== "LIVE" && listing.status !== "APPROVED")) {
      return NextResponse.json({ error: "Listing not available" }, { status: 404 });
    }

    // Format response with seller name
    const formatted = {
      ...listing,
      seller: {
        id: listing.seller.id,
        full_name: [listing.seller.firstName, listing.seller.lastName]
          .filter(Boolean)
          .join(" "),
        country: listing.seller.country,
      },
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("[LISTINGS_ID_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        role: true,
        isVerifiedMiner: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const listing = await prisma.productListing.findUnique({
      where: { id },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const normalizedRole = (user.role ?? "").toLowerCase();
    const canEdit =
      listing.sellerId === user.id ||
      normalizedRole === "admin" ||
      user.isVerifiedMiner === true;

    if (!canEdit) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    const dataToUpdate: Record<string, unknown> = {};

    if (typeof body.title === "string") {
      dataToUpdate.title = body.title;
    }

    if (typeof body.description === "string") {
      dataToUpdate.description = body.description;
    }

    if (typeof body.category === "string") {
      dataToUpdate.category = mapCategoryToEnum(body.category);
    }

    if (Array.isArray(body.imageUrls)) {
      dataToUpdate.imageUrls = body.imageUrls;
    }

    if (body.quantity !== undefined) {
      dataToUpdate.quantity = parseFloat(body.quantity);
    }

    if (typeof body.unit === "string") {
      dataToUpdate.unit = mapUnitToEnum(body.unit);
    }

    if (body.purityGrade !== undefined) {
      dataToUpdate.purityGrade = body.purityGrade || null;
    }

    if (body.pricePerUnit !== undefined) {
      dataToUpdate.pricePerUnit = parseFloat(body.pricePerUnit);
    }

    if (typeof body.country === "string") {
      dataToUpdate.country = body.country;
    }

    if (body.region !== undefined) {
      dataToUpdate.region = body.region || null;
    }

    if (body.shippingDetails !== undefined) {
      dataToUpdate.shippingDetails = body.shippingDetails || null;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return new NextResponse("No fields provided for update", { status: 400 });
    }

    const updatedListing = await prisma.productListing.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ data: updatedListing });
  } catch (error) {
    console.error("[LISTINGS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

