import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Shield, 
  Lock, 
  Truck, 
  CheckCircle, 
  FileText,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">
            How BixiRoad Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlike traditional marketplaces, BixiRoad physically handles every transaction to ensure authenticity, 
            quality, and compliance. Here's our complete process.
          </p>
        </div>

        {/* Overview Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-10 text-center">The Complete Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-xl transition-all border-2 border-transparent hover:border-[#D4AF37]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1A1A1A]">
                1
              </div>
              <Package className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Seller Ships to Hub</h3>
              <p className="text-sm text-gray-600">Verified miners send products to our Verification Hub</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all border-2 border-transparent hover:border-[#D4AF37]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1A1A1A]">
                2
              </div>
              <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">We Verify</h3>
              <p className="text-sm text-gray-600">Certified assayers examine, test, and authenticate</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all border-2 border-transparent hover:border-[#D4AF37]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1A1A1A]">
                3
              </div>
              <Lock className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Buyer Purchases</h3>
              <p className="text-sm text-gray-600">Payment held in secure escrow protection</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all border-2 border-transparent hover:border-[#D4AF37]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1A1A1A]">
                4
              </div>
              <Truck className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">We Ship Globally</h3>
              <p className="text-sm text-gray-600">International delivery with full customs handling</p>
            </Card>
          </div>
        </div>

        {/* For Sellers Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F4E4BC]/10 rounded-3xl p-12 border-2 border-[#D4AF37]/20">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">For Sellers (Miners)</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Get Verified</h3>
                  <p className="text-gray-700 mb-3">
                    Submit your mining licenses, identification documents, and business details. 
                    Our compliance team reviews within 3-5 business days.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                    <p className="text-sm font-semibold text-gray-800 mb-2">📋 Required Documents:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Valid mining license or extraction permit</li>
                      <li>• Government-issued ID or passport</li>
                      <li>• Company registration (if applicable)</li>
                      <li>• Mine location and operational proof</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Create Your Listing</h3>
                  <p className="text-gray-700 mb-3">
                    Provide detailed descriptions, upload quality photos, set quantities, purity grades, and pricing. 
                    Our team reviews your listing for accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    Ship to BixiRoad Verification Hub
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Important:</strong> You ship products domestically to our Verification Hub 
                    (shipping address provided after listing approval).
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                    <p className="text-sm font-semibold text-gray-800 mb-2">📦 Shipping Guidelines:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Package securely to prevent damage</li>
                      <li>• Include listing reference number</li>
                      <li>• Use trackable shipping service</li>
                      <li>• Upload tracking number to your dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    BixiRoad Verification Process
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Our certified assayers physically examine your product (typically 3-7 business days):
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                      <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-800 mb-1">Visual Inspection</p>
                      <p className="text-xs text-gray-600">Quality, condition, and characteristics</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                      <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-800 mb-1">Purity Testing</p>
                      <p className="text-xs text-gray-600">XRF analysis and spectrometry</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                      <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-800 mb-1">Weight Verification</p>
                      <p className="text-xs text-gray-600">Precise measurement and documentation</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                      <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-800 mb-1">Certification</p>
                      <p className="text-xs text-gray-600">Official assay report generated</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Product Goes Live</h3>
                  <p className="text-gray-700 mb-3">
                    Once verified, your product becomes "Active" on the marketplace with our verification seal. 
                    Buyers can now purchase with confidence.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    Get Paid
                    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  </h3>
                  <p className="text-gray-700 mb-3">
                    When a buyer purchases, payment is held in escrow. After successful delivery confirmation:
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">💰 Payment Breakdown:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Sale Price: <span className="text-[#D4AF37] font-bold">100%</span></li>
                      <li>• BixiRoad Commission: <span className="text-gray-600">7.5%</span></li>
                      <li>• You Receive: <span className="text-green-600 font-bold">92.5%</span></li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Commission covers verification, storage, international shipping, and platform costs.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/become-seller">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] font-semibold">
                  <Shield className="w-5 h-5 mr-2" />
                  Become a Verified Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* For Buyers Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">For Buyers</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Browse Verified Products</h3>
                  <p className="text-gray-700 mb-3">
                    All products have already been physically verified by BixiRoad. Search by category, country, 
                    purity grade, or price range.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">✅ Every Listing Includes:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Verification status and date</li>
                      <li>• Assay report (available after purchase)</li>
                      <li>• Verified seller profile</li>
                      <li>• Actual product photos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Make Inquiries (Optional)</h3>
                  <p className="text-gray-700 mb-3">
                    Have questions? Use the inquiry form on product pages. BixiRoad mediates all communication 
                    and relays questions/answers between you and the seller.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    Purchase with Escrow Protection
                    <Lock className="w-5 h-5 text-blue-600" />
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Select quantity and complete payment. Your funds are held securely in escrow and 
                    will not be released to the seller until you confirm delivery.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">🔒 Escrow Guarantees:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Money back if product doesn't arrive</li>
                      <li>• Dispute resolution if quality issues arise</li>
                      <li>• BixiRoad as neutral intermediary</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    BixiRoad Ships to You
                    <Truck className="w-5 h-5 text-blue-600" />
                  </h3>
                  <p className="text-gray-700 mb-3">
                    We handle everything: packaging, export documentation, customs clearance, and international shipping. 
                    You receive tracking information and estimated delivery dates.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">📦 Included with Shipping:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Secure, insured packaging</li>
                      <li>• Full tracking from hub to your door</li>
                      <li>• Export certificates and documentation</li>
                      <li>• Customs clearance handled by us</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Receive & Confirm</h3>
                  <p className="text-gray-700 mb-3">
                    Once delivered, inspect your product. If satisfied, confirm delivery in your dashboard. 
                    Funds are then released to the seller. If there are issues, open a dispute.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Leave a Review</h3>
                  <p className="text-gray-700">
                    Help the community by leaving an honest review about the seller, product quality, 
                    and your overall experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/marketplace">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <Package className="w-5 h-5 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Why This Model Works */}
        <div className="mb-12">
          <Card className="border-2 border-[#D4AF37]">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6 text-center">
                Why Our Model Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Builds Trust</h3>
                  <p className="text-gray-600 text-sm">
                    Physical verification eliminates doubts about authenticity and quality
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Ensures Compliance</h3>
                  <p className="text-gray-600 text-sm">
                    Every transaction meets international trade laws and ethical standards
                  </p>
                </div>
                <div className="text-center">
                  <Truck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Simplifies Logistics</h3>
                  <p className="text-gray-600 text-sm">
                    We handle complex international shipping so you don't have to
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}