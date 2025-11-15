import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client/client";

const prisma = new PrismaClient();

const countries = [
  { name: "Ghana", flag: "🇬🇭", code: "GH", minerCount: 0},
  { name: "Kenya", flag: "🇰🇪", code: "KE", minerCount: 0 },
  { name: "Tanzania", flag: "🇹🇿", code: "TZ", minerCount: 0 },
  { name: "Zambia", flag: "🇿🇲", code: "ZM", minerCount: 0 },
  { name: "South Africa", flag: "🇿🇦", code: "ZA", minerCount: 0 },
  { name: "DRC", flag: "🇨🇩", code: "CD", minerCount: 0 },
  { name: "Nigeria", flag: "🇳🇬", code: "NG", minerCount: 0 },
  { name: "Botswana", flag: "🇧🇼", code: "BW", minerCount: 0 },
  { name: "Zimbabwe", flag: "🇿🇼", code: "ZW", minerCount: 0},
  { name: "Mozambique", flag: "🇲🇿", code: "MZ", minerCount: 0 },
];

async function main() {
  console.log("🌍 Seeding countries...");

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {
        name: country.name,
        flag: country.flag,
        minerCount: country.minerCount,
        isActive: true,
      },
      create: {
        name: country.name,
        flag: country.flag,
        code: country.code,
        minerCount: country.minerCount,
        isActive: true,
      },
    });
    console.log(`✅ Seeded country: ${country.name}`);
  }

  console.log("✅ Countries seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding countries:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

