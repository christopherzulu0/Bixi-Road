-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('GOLD', 'DIAMOND', 'EMERALD', 'RUBY', 'SAPPHIRE', 'COPPER', 'LITHIUM', 'COBALT', 'COLTAN', 'URANIUM', 'IRON_ORE', 'BAUXITE', 'OTHER_GEMSTONE', 'OTHER_MINERAL');

-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('GRAMS', 'KILOGRAMS', 'TONNES', 'CARATS', 'PIECES');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SHIPPED_TO_HUB', 'VERIFIED', 'LIVE', 'SOLD', 'CANCELLED');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "product_listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "image_urls" TEXT[],
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" "ProductUnit" NOT NULL,
    "purity_grade" TEXT,
    "price_per_unit" DOUBLE PRECISION NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "shipping_details" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "seller_id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_listings_seller_id_idx" ON "product_listings"("seller_id");

-- CreateIndex
CREATE INDEX "product_listings_category_idx" ON "product_listings"("category");

-- CreateIndex
CREATE INDEX "product_listings_status_idx" ON "product_listings"("status");

-- CreateIndex
CREATE INDEX "product_listings_is_active_idx" ON "product_listings"("is_active");

-- CreateIndex
CREATE INDEX "product_listings_approved_at_idx" ON "product_listings"("approved_at");

-- AddForeignKey
ALTER TABLE "product_listings" ADD CONSTRAINT "product_listings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
