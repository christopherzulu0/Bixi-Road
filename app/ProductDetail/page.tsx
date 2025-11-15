'use client'

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  MapPin, 
  Package, 
  DollarSign, 
  Lock,
  ArrowLeft,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import InquiryForm from "@/components/inquiries/InquiryForm";

type ProductDetail = {
  id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity: number;
  purity_grade?: string;
  country: string;
  region?: string;
  shipping_details?: string;
  image_urls: string[];
  seller: {
    id?: string;
    full_name: string;
    country: string;
  };
  views: number;
  created_date: string;
};

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-full aspect-[4/3] rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Price Card */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-24" />
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProductDetailContent({ productId }: { productId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasIncrementedViews, setHasIncrementedViews] = useState(false);

  // Increment view count once when component mounts
  useEffect(() => {
    if (productId && !hasIncrementedViews) {
      const incrementViews = async () => {
        try {
          await fetch(`/api/listings/${productId}`, {
            method: "PUT",
          });
          setHasIncrementedViews(true);
          // Invalidate and refetch product data to get updated view count
          queryClient.invalidateQueries({ queryKey: ["product", productId] });
        } catch (error) {
          console.error("Failed to increment views:", error);
        }
      };
      incrementViews();
    }
  }, [productId, hasIncrementedViews, queryClient]);

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await fetch(`/api/listings/${productId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch product");
      const json = await res.json();
      
      // Handle API response format and normalize to ProductDetail
      const listing = json.data || json;
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        price_per_unit: listing.pricePerUnit || listing.price_per_unit,
        unit: listing.unit,
        quantity: listing.quantity,
        purity_grade: listing.purityGrade || listing.purity_grade,
        country: listing.country,
        region: listing.region,
        shipping_details: listing.shippingDetails || listing.shipping_details,
        image_urls: listing.imageUrls || listing.image_urls,
        seller: listing.seller ? {
          id: listing.seller.id,
          full_name: listing.seller.full_name || [listing.seller.firstName, listing.seller.lastName].filter(Boolean).join(" ") || "Unknown Seller",
          country: listing.seller.country || listing.country,
        } : { full_name: "Unknown Seller", country: listing.country },
        views: listing.views || 0,
        created_date: listing.createdAt || listing.created_date,
      };
    },
    enabled: Boolean(productId),
  });

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const images =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop"];

  const totalPrice = quantity * product.price_per_unit;

  const handlePurchase = async () => {
    if (!product) return;

    // Validate quantity
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} ${product.unit} available`);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process purchase");
      }

      // Success
      alert(data.message || "Purchase completed successfully! Redirecting to dashboard...");
      router.push("/BuyerDashboard");
    } catch (error) {
      console.error("Purchase error:", error);
      alert(error instanceof Error ? error.message : "Failed to process purchase. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6 text-[#1A1A1A]" />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4">
                <Badge className="bg-[#D4AF37] text-[#1A1A1A] border-0 font-semibold">
                  {product.category}
                </Badge>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-[#D4AF37]" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold text-sm">VERIFIED SELLER</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{product.views || 0} views</span>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Price Card */}
            <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#F4E4BC]/20 to-white">
              <CardContent className="p-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price per {product.unit}</p>
                    <p className="text-4xl font-bold text-[#D4AF37]">
                      ${product.price_per_unit.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-[#D4AF37] opacity-50" />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available</span>
                    <span className="font-semibold">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  {product.purity_grade && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purity/Grade</span>
                      <span className="font-semibold">{product.purity_grade}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin</span>
                    <span className="font-semibold flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {product.country}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Section */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity ({product.unit})
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))
                    }
                    className="h-12 text-lg border-2"
                  />
                </div>

                <div className="flex justify-between items-center text-lg pt-4 border-t">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <Alert>
                  <Lock className="w-4 h-4" />
                  <AlertDescription>
                    Your payment will be held in escrow until you confirm delivery
                  </AlertDescription>
                </Alert>

                <Button
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isProcessing || product.quantity === 0}
                  className="w-full bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] font-semibold text-lg h-14"
                >
                  {isProcessing ? "Processing..." : "Buy via Secure Escrow"}
                </Button>
              </CardContent>
            </Card>
             
         {/* Inquiry Form */}
         {product && <InquiryForm product={product} />}


            {/* Seller Info */}
            {product.seller && (
              <Card className="border-2 border-gray-200 hover:border-[#D4AF37] transition-all">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">About the Seller</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A]">
                      {product.seller.full_name?.[0] || "M"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1A1A1A] mb-1">{product.seller.full_name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-semibold text-[#D4AF37]">CERTIFIED MINER</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {product.seller.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Info */}
            {product.shipping_details && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-bold text-lg">Shipping & Export</h3>
                  </div>
                  <p className="text-gray-700">{product.shipping_details}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailWrapper() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  if (!productId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Product Not Found</h1>
          <p className="text-gray-600">No product ID provided</p>
        </div>
      </div>
    );
  }

  return <ProductDetailContent productId={productId} />;
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailWrapper />
    </Suspense>
  );
}
