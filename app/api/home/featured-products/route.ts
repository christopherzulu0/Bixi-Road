import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FeaturedProduct = {
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

type FeaturedProductsResponse = {
  data: FeaturedProduct[];
};

export async function GET() {
  try {
    // Fetch featured products (active, approved/live listings)
    const products = await prisma.productListing.findMany({
      where: {
        isActive: true,
        status: {
          in: ["LIVE", "APPROVED"],
        },
      },
      orderBy: [
        { views: "desc" },
        { createdAt: "desc" },
      ],
      take: 6,
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

    const formatted: FeaturedProduct[] = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category.toString(),
      price_per_unit: product.pricePerUnit,
      unit: product.unit.toString(),
      quantity: product.quantity,
      purity_grade: product.purityGrade || null,
      country: product.country,
      image_urls: product.imageUrls || [],
      seller: {
        full_name: [product.seller.firstName, product.seller.lastName]
          .filter(Boolean)
          .join(" "),
        country: product.seller.country || "",
      },
      is_featured: true,
      status: "active",
      views: product.views || 0,
    }));

    const response: FeaturedProductsResponse = {
      data: formatted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[HOME_FEATURED_PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}

