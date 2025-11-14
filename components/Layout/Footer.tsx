import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#D4AF37]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-[#1A1A1A]">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FFFFF0]">BixiRoad</h3>
                <p className="text-sm text-[#D4AF37]">Where Africa Trades Its Treasures</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Africa's first verified marketplace for raw materials and precious minerals.
              We physically receive, authenticate, and ship every product through secure escrow transactions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#FFFFF0] mb-4">Platform</h4>
            <div className="space-y-2">
              <Link href="/MarketPlace" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Browse Marketplace
              </Link>
              <Link href="/BecomeSeller" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Become a Seller
              </Link>
              <Link href="/News" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Market News
              </Link>
              <Link href="/HowItWorks" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                How It Works
              </Link>
              <Link href="/ShippingInfo" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Shipping Info
              </Link>
              <Link href="/FAQ" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#FFFFF0] mb-4">Company</h4>
            <div className="space-y-2">
              <Link href="/AboutUs" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                About Us
              </Link>
              <Link href="/ContactPage" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Terms of Service
              </Link>
              <Link href="/#" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Cookies Policy
              </Link>
              <Link href="/CommunityGuidelines" className="block text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Community Guidelines
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2025 BixiRoad. All rights reserved. Built for Africa's future.
            </p>
            <a
              href="https://mjanja.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors group"
            >
              <span>Powered by</span>
              <span className="font-semibold group-hover:underline">mjanja.ai</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

