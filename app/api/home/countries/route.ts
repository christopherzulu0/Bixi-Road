import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@/src/generated/prisma/client/client";

type Country = {
  id: string;
  name: string;
  flag: string;
  code: string;
  miner_count: number;
  is_active: boolean;
};

type CountriesResponse = {
  data: Country[];
};

export async function GET() {
  try {
    // Fetch all active countries
    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        flag: true,
        code: true,
        isActive: true,
      },
    });

    // Count verified miners per country from SellerApplication
    // Only count approved seller applications (verified miners)
    const minerCounts = await prisma.sellerApplication.groupBy({
      by: ['country'],
      where: {
        status: $Enums.SellerApplicationStatus.APPROVED,
      },
      _count: {
        id: true,
      },
    });

    // Create a map of country name (normalized to lowercase) to miner count
    const minerCountMap = new Map<string, number>();
    minerCounts.forEach((item) => {
      if (item.country) {
        // Normalize country name to lowercase for case-insensitive matching
        const normalizedCountry = item.country.trim().toLowerCase();
        const count = typeof item._count === 'object' && item._count !== null && 'id' in item._count
          ? item._count.id
          : 0;
        const existingCount = minerCountMap.get(normalizedCountry) || 0;
        minerCountMap.set(normalizedCountry, existingCount + count);
      }
    });

    // Format the response with dynamic miner counts
    const formatted: Country[] = countries
      .map((country) => {
        // Match country by name (case-insensitive)
        const normalizedCountryName = country.name.trim().toLowerCase();
        const minerCount = minerCountMap.get(normalizedCountryName) || 0;
        
        return {
          id: country.id,
          name: country.name,
          flag: country.flag,
          code: country.code,
          miner_count: minerCount,
          is_active: country.isActive,
        };
      })
      // Sort by miner count (descending), then by name
      .sort((a, b) => {
        if (b.miner_count !== a.miner_count) {
          return b.miner_count - a.miner_count;
        }
        return a.name.localeCompare(b.name);
      });

    const response: CountriesResponse = {
      data: formatted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[HOME_COUNTRIES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

