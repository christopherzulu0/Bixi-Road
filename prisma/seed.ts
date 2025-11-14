import { PrismaClient, ProductCategory, ProductUnit, ListingStatus } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const USER_ID = "cmhypqjcz0001s3curi4jnkry";

const productListings = [
  {
    title: "Premium 24K Gold Nuggets",
    category: "GOLD",
    description: "High-quality 24K gold nuggets extracted from the Ashanti Region mines. Each nugget is hand-selected for purity and authenticity. Perfect for collectors and investors seeking premium African gold.",
    imageUrls: [
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop"
    ],
    quantity: 150.5,
    unit: "GRAMS",
    purityGrade: "24K (99.9% pure)",
    pricePerUnit: 1850.00,
    country: "Ghana",
    region: "Ashanti Region",
    shippingDetails: "Ships from Accra, Ghana. International shipping available. Export documentation included. Estimated delivery: 7-14 business days.",
    status: "LIVE",
    views: 245,
    isActive: true,
  },
  {
    title: "Raw Gold Ore - High Grade",
    category: "GOLD",
    description: "Unprocessed gold ore with high concentration from our primary mining site. Suitable for refining or direct processing. Certificate of origin included.",
    imageUrls: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
    ],
    quantity: 500.0,
    unit: "KILOGRAMS",
    purityGrade: "Raw ore (estimated 15-20g per ton)",
    pricePerUnit: 1200.00,
    country: "Ghana",
    region: "Western Region",
    shippingDetails: "Bulk shipping available. FOB Accra port. Export permits arranged.",
    status: "LIVE",
    views: 189,
    isActive: true,
  },
  {
    title: "Emerald Crystals - Zambian Origin",
    category: "EMERALD",
    description: "Natural emerald crystals from the Kafubu mining area. Deep green color with excellent clarity. Each piece is individually graded and certified.",
    imageUrls: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop"
    ],
    quantity: 25.0,
    unit: "CARATS",
    purityGrade: "AAA Grade - VVS clarity",
    pricePerUnit: 450.00,
    country: "Zambia",
    region: "Kafubu Area",
    shippingDetails: "International shipping with insurance. Gemological certificate included. Secure packaging guaranteed.",
    status: "LIVE",
    views: 312,
    isActive: true,
  },
  {
    title: "Copper Concentrate - 99.5% Pure",
    category: "COPPER",
    description: "High-grade copper concentrate ready for smelting. Extracted from our modern processing facility. Meets international export standards.",
    imageUrls: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    ],
    quantity: 10.0,
    unit: "TONNES",
    purityGrade: "99.5% Cu",
    pricePerUnit: 8500.00,
    country: "Zambia",
    region: "Copperbelt Province",
    shippingDetails: "Containerized shipping. FOB Dar es Salaam port. Export documentation provided.",
    status: "LIVE",
    views: 156,
    isActive: true,
  },
  {
    title: "Diamond Rough - Industrial Grade",
    category: "DIAMOND",
    description: "Industrial-grade diamond rough suitable for cutting tools and industrial applications. Sourced from certified conflict-free mines.",
    imageUrls: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop"
    ],
    quantity: 100.0,
    unit: "CARATS",
    purityGrade: "Industrial grade",
    pricePerUnit: 85.00,
    country: "South Africa",
    region: "Kimberley",
    shippingDetails: "KPCS certified. International shipping with full documentation. Insurance included.",
    status: "APPROVED",
    views: 98,
    isActive: true,
  },
  {
    title: "Cobalt Ore - Battery Grade",
    category: "COBALT",
    description: "High-purity cobalt ore essential for battery manufacturing. Extracted from DRC mines with full traceability. Meets EV industry standards.",
    imageUrls: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    ],
    quantity: 5.0,
    unit: "TONNES",
    purityGrade: "Battery grade (min 20% Co)",
    pricePerUnit: 32000.00,
    country: "DRC",
    region: "Katanga Province",
    shippingDetails: "Container shipping. Export permits and certificates of origin included. FOB port of Matadi.",
    status: "LIVE",
    views: 421,
    isActive: true,
  },
  {
    title: "Ruby Gemstones - Premium Quality",
    category: "RUBY",
    description: "Natural ruby gemstones with vibrant red color. Each stone is hand-selected and comes with gemological certification. Perfect for jewelry making.",
    imageUrls: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop"
    ],
    quantity: 50.0,
    unit: "CARATS",
    purityGrade: "AAA Grade - Natural untreated",
    pricePerUnit: 650.00,
    country: "Tanzania",
    region: "Longido District",
    shippingDetails: "Secure shipping with insurance. Gemological certificate from GIA included.",
    status: "LIVE",
    views: 278,
    isActive: true,
  },
  {
    title: "Lithium Spodumene - High Grade",
    category: "LITHIUM",
    description: "High-grade spodumene concentrate for lithium extraction. Essential for battery production. Sourced from verified mines with full documentation.",
    imageUrls: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    ],
    quantity: 20.0,
    unit: "TONNES",
    purityGrade: "6% Li2O minimum",
    pricePerUnit: 12500.00,
    country: "Zimbabwe",
    region: "Bikita",
    shippingDetails: "Bulk shipping available. Export permits arranged. FOB Beira port.",
    status: "APPROVED",
    views: 134,
    isActive: true,
  },
  {
    title: "Iron Ore Lumps - 62% Fe",
    category: "IRON_ORE",
    description: "High-grade iron ore lumps suitable for steel production. Consistent quality with low impurities. Ready for export.",
    imageUrls: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    ],
    quantity: 100.0,
    unit: "TONNES",
    purityGrade: "62% Fe content",
    pricePerUnit: 95.00,
    country: "South Africa",
    region: "Sishen",
    shippingDetails: "Bulk carrier shipping. FOB Saldanha Bay. Quality certificates provided.",
    status: "LIVE",
    views: 167,
    isActive: true,
  },
  {
    title: "Coltan Ore - Tantalum Source",
    category: "COLTAN",
    description: "Coltan ore (columbite-tantalite) essential for electronics manufacturing. Sourced from certified conflict-free mines in DRC. Full traceability guaranteed.",
    imageUrls: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    ],
    quantity: 2.5,
    unit: "TONNES",
    purityGrade: "30% Ta2O5 minimum",
    pricePerUnit: 45000.00,
    country: "DRC",
    region: "North Kivu",
    shippingDetails: "Secure shipping with full documentation. Conflict-free certification included. FOB port of Mombasa.",
    status: "LIVE",
    views: 203,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: USER_ID },
  });

  if (!user) {
    console.error(`❌ User with ID ${USER_ID} not found!`);
    console.error("Please ensure the user exists before running the seed.");
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.firstName} ${user.lastName || ""}`);

  // Create product listings
  console.log("\n📦 Creating product listings...");
  
  for (const listing of productListings) {
    try {
      const created = await prisma.productListing.create({
        data: {
          ...listing,
          category: listing.category as ProductCategory,
          unit: listing.unit as ProductUnit,
          status: listing.status as ListingStatus,
          sellerId: USER_ID,
          approvedAt: listing.status === "LIVE" || listing.status === "APPROVED" 
            ? new Date() 
            : null,
        },
      });
      console.log(`✅ Created: ${created.title} (${created.status})`);
    } catch (error) {
      console.error(`❌ Failed to create: ${listing.title}`, error);
    }
  }

  console.log("\n✨ Seed completed!");
  console.log(`📊 Created ${productListings.length} product listings for user ${USER_ID}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

