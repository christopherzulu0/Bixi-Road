import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ChevronRight
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InquiryForm from "../components/inquiries/InquiryForm";

// Static product data
const product = {
  id: "prod-1",
  title: "Premium 24K Gold Nuggets",
  description: "High-quality gold nuggets sourced directly from Ghana's Ashanti Region. These nuggets are verified at 99.9% purity and come with full certification documents. Perfect for investment or jewelry making.",
  category: "Gold",
  image_urls: [
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop"
  ],
  price_per_unit: 1850,
  unit: "grams",
  quantity: 100,
  purity_grade: "24K",
  country: "Ghana",
  region: "Ashanti Region",
  shipping_details: "Standard international shipping available. Export documents included. Estimated delivery 5-10 business days.",
  seller_id: "seller-1",
  seller_name: "Ghana Gold Mining Co.",
  views: 342,
  hub_status: "verified",
  verification_report_url: "https://example.com/report.pdf"
};

const seller = {
  id: "seller-1",
  full_name: "Ghana Gold Mining Co.",
  country: "Ghana",
  rating_average: 4.5,
  total_reviews: 23
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : [`https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop`];

  const totalPrice = quantity * product.price_per_unit;

  const handlePurchase = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Purchase initiated! Redirecting to dashboard...");
      navigate(createPageUrl("BuyerDashboard"));
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Marketplace"))}
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
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
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
                      idx === currentImageIndex ? 'border-[#D4AF37]' : 'border-transparent'
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
              <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
                {product.title}
              </h1>
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
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>
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
                    <span className="font-semibold">{product.quantity} {product.unit}</span>
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
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
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

            {/* Verification Status Badge */}
            {product.hub_status === 'verified' && product.verification_report_url && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 mb-2">✅ Verified by BixiRoad</h3>
                      <p className="text-sm text-green-800 mb-3">
                        This product has been physically examined and authenticated by our certified assayers.
                      </p>
                      <a 
                        href={product.verification_report_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 font-semibold hover:underline"
                      >
                        View Verification Report →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inquiry Form */}
            {product && <InquiryForm product={product} />}

            {/* Seller Info */}
            {seller && (
              <Card className="border-2 border-gray-200 hover:border-[#D4AF37] transition-all">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">About the Seller</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A]">
                      {seller.full_name?.[0] || 'M'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1A1A1A] mb-1">{seller.full_name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-semibold text-[#D4AF37]">CERTIFIED MINER</span>
                      </div>
                      {seller.rating_average > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="font-semibold">{seller.rating_average.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({seller.total_reviews} reviews)</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {seller.country}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
                    onClick={() => navigate(`${createPageUrl("MinerProfile")}?id=${seller.id}`)}
                  >
                    View Seller Profile
                  </Button>
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
