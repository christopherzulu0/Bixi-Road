import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const listings = await prisma.productListing.findMany({
      where: { status: "PENDING_REVIEW", isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            country: true,
          },
        },
      },
    });

    const data = listings.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      seller_name: [p.seller.firstName, p.seller.lastName].filter(Boolean).join(" "),
      price_per_unit: p.pricePerUnit,
      unit: p.unit,
      quantity: p.quantity,
      status: "pending_approval",
      image_urls: p.imageUrls,
      country: p.country ?? p.seller.country ?? undefined,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/pending-products error", error);
    return NextResponse.json({ error: "Failed to fetch pending products" }, { status: 500 });
  }
}