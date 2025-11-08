import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Globe, CheckCircle, Package, Users, Award } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-[#1A1A1A]" />
          </div>
          <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">
            About BixiRoad
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're transforming how Africa trades its natural treasures—building the continent's first 
            fully verified, secure marketplace for minerals and precious stones.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="border-2 border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                To empower African miners with direct access to global markets while providing international buyers 
                with guaranteed authenticity and quality. We bridge the trust gap through our physical Verification Hub, 
                where every product is examined by certified assayers before reaching buyers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Problem We Solve */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">The Problem We Solve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-red-50 border-2 border-red-200">
              <h3 className="font-bold text-lg text-red-900 mb-3">❌ Trust Deficit</h3>
              <p className="text-gray-700">
                International buyers hesitate to purchase African minerals due to concerns about authenticity, 
                conflict sourcing, and fraudulent sellers.
              </p>
            </Card>
            <Card className="p-6 bg-red-50 border-2 border-red-200">
              <h3 className="font-bold text-lg text-red-900 mb-3">❌ Market Access Barriers</h3>
              <p className="text-gray-700">
                African miners struggle with complex export procedures, international shipping, 
                and finding legitimate buyers willing to pay fair prices.
              </p>
            </Card>
            <Card className="p-6 bg-red-50 border-2 border-red-200">
              <h3 className="font-bold text-lg text-red-900 mb-3">❌ No Verification Standard</h3>
              <p className="text-gray-700">
                Existing marketplaces allow direct seller-to-buyer transactions without proper 
                quality verification or authenticity guarantees.
              </p>
            </Card>
          </div>
        </div>

        {/* Our Solution */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">The BixiRoad Solution</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-[#D4AF37]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Physical Verification Hub</h3>
              <p className="text-gray-700 leading-relaxed">
                Our central facility receives every product from sellers. Certified assayers with international 
                credentials physically examine, test purity, verify authenticity, and document quality before approval.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-[#D4AF37]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Mandatory Escrow Protection</h3>
              <p className="text-gray-700 leading-relaxed">
                All payments are held securely until buyers confirm delivery. This protects both parties: 
                sellers get guaranteed payment, buyers get verified products or their money back.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-[#D4AF37]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">International Logistics</h3>
              <p className="text-gray-700 leading-relaxed">
                We handle all export documentation, customs clearance, and international shipping. 
                Sellers ship domestically to our hub; we handle the complex global delivery to buyers.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-[#D4AF37]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Compliance & Ethics</h3>
              <p className="text-gray-700 leading-relaxed">
                Every seller is verified with valid mining licenses. We ensure zero conflict minerals, 
                no forced labor, and full compliance with international trade laws and ethical sourcing standards.
              </p>
            </Card>
          </div>
        </div>

        {/* Our Verification Hub */}
        <div className="mb-16">
          <Card className="border-2 border-[#D4AF37]">
            <CardContent className="p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-2xl flex items-center justify-center">
                    <Award className="w-16 h-16 text-[#1A1A1A]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Our Verification Hub</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Located strategically to serve pan-African operations, our state-of-the-art Verification Hub 
                    is equipped with:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span><strong>Certified Assayers:</strong> Internationally recognized gemologists and metallurgists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span><strong>Advanced Testing Equipment:</strong> XRF analyzers, spectrometers, and purity testing tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span><strong>Secure Storage:</strong> Climate-controlled vaults for safekeeping pre and post-purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span><strong>Documentation Center:</strong> Generating certificates of authenticity and compliance reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Trust First</h3>
              <p className="text-gray-600">
                Every decision prioritizes building and maintaining trust between African sellers and global buyers.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">African Empowerment</h3>
              <p className="text-gray-600">
                We exist to elevate African miners, giving them fair market access and competitive pricing.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Transparency</h3>
              <p className="text-gray-600">
                Clear processes, honest communication, and full disclosure at every stage of trade.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Ethical Sourcing</h3>
              <p className="text-gray-600">
                Zero tolerance for conflict minerals, forced labor, or illegal mining operations.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Innovation</h3>
              <p className="text-gray-600">
                Constantly improving verification technology and marketplace features for better experiences.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Fair Commission</h3>
              <p className="text-gray-600">
                Our 7.5% commission covers verification, logistics, and platform costs—kept low for seller benefit.
              </p>
            </Card>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#3E2723] border-2 border-[#D4AF37]">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-[#FFFFF0] mb-8 text-center">Our Growing Impact</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-[#D4AF37] mb-2">500+</div>
                  <div className="text-[#FFFFF0]">Verified Miners</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-[#D4AF37] mb-2">15+</div>
                  <div className="text-[#FFFFF0]">African Countries</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-[#D4AF37] mb-2">10k+</div>
                  <div className="text-[#FFFFF0]">Products Verified</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-[#D4AF37] mb-2">$50M+</div>
                  <div className="text-[#FFFFF0]">Trade Volume</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            BixiRoad is led by a diverse team of mining industry experts, international trade specialists, 
            certified gemologists, and technology innovators—all united by the mission to transform African mineral trade.
          </p>
          <Card className="p-8 max-w-2xl mx-auto bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20">
            <Users className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
            <p className="text-gray-700 italic">
              "We're not just building a marketplace—we're building the infrastructure for Africa's 
              mineral wealth to benefit African people directly, transparently, and ethically."
            </p>
            <p className="text-[#D4AF37] font-semibold mt-4">- The BixiRoad Team</p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Join the Movement</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a miner seeking global markets or a buyer seeking authentic African minerals, 
            BixiRoad is your trusted partner.
          </p>
        </div>
      </div>
    </div>
  );
}