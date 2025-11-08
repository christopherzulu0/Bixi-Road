'use client'

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is BixiRoad?",
          a: "BixiRoad is Africa's first fully verified marketplace for minerals and precious stones. We physically receive, authenticate, and ship every product through our Verification Hub, ensuring buyers get genuine products and sellers reach global markets securely."
        },
        {
          q: "How is BixiRoad different from other marketplaces?",
          a: "Unlike platforms that simply connect buyers and sellers, BixiRoad acts as a full-service intermediary. We physically handle every product: sellers ship to our Verification Hub, our certified assayers examine and authenticate items, we secure payments in escrow, and we handle international shipping to buyers."
        },
        {
          q: "What countries do you operate in?",
          a: "We work with verified miners across 15+ African countries including Ghana, Kenya, Tanzania, Zambia, South Africa, DRC, Nigeria, Zimbabwe, and more. We ship products globally to buyers worldwide."
        }
      ]
    },
    {
      category: "For Sellers",
      questions: [
        {
          q: "How do I become a verified seller?",
          a: "Submit your mining license, government-issued ID, company registration (if applicable), and mine location details. Pay a one-time $100 verification fee. Our team reviews within 3-5 business days. Once approved, you can create listings."
        },
        {
          q: "Where do I ship my products?",
          a: "You ship products to BixiRoad's Verification Hub (address provided after listing approval). You do NOT ship directly to buyers. All products must pass through our physical verification process before being listed as active."
        },
        {
          q: "How long does verification take?",
          a: "Typically 3-7 business days after your product arrives at our hub. Certified assayers physically examine, test purity, verify authenticity, and generate official assay reports."
        },
        {
          q: "What if my product is rejected?",
          a: "If products don't meet stated quality or authenticity standards, they're returned to you with detailed rejection reasons. Return shipping costs are borne by the seller."
        },
        {
          q: "How much commission does BixiRoad charge?",
          a: "7.5% commission on successful sales. This covers verification, secure storage, international shipping, customs handling, and platform costs. You receive 92.5% of the sale price."
        },
        {
          q: "When do I get paid?",
          a: "Funds are released after the buyer confirms delivery. Payments typically process within 3-5 business days of confirmation."
        },
        {
          q: "Can I communicate directly with buyers?",
          a: "No. All inquiries are mediated by BixiRoad to ensure accuracy, prevent fraud, and maintain transaction integrity. We relay questions and answers between parties."
        }
      ]
    },
    {
      category: "For Buyers",
      questions: [
        {
          q: "Are all products verified before I buy?",
          a: "Yes! Every product marked 'Active' has already been physically received at our Verification Hub, examined by certified assayers, tested for purity/authenticity, and documented with official reports."
        },
        {
          q: "How do I know products are authentic?",
          a: "Our certified assayers use XRF analyzers, spectrometers, and advanced testing equipment. Each product comes with a verification report detailing purity, weight, and quality characteristics. These reports are available after purchase."
        },
        {
          q: "What is escrow protection?",
          a: "Your payment is held securely by BixiRoad until you confirm delivery. If the product doesn't arrive or quality issues arise, funds can be refunded through our dispute resolution process."
        },
        {
          q: "Who handles shipping?",
          a: "BixiRoad handles all international shipping from our Verification Hub to your address. We arrange secure packaging, export documentation, customs clearance, and provide tracking information."
        },
        {
          q: "How long does delivery take?",
          a: "International shipping typically takes 7-21 business days depending on destination country and customs processing. You'll receive estimated delivery dates and tracking information."
        },
        {
          q: "Do I pay import duties?",
          a: "Yes. Import duties, taxes, and fees imposed by your country are the buyer's responsibility. BixiRoad provides all necessary documentation for customs clearance."
        },
        {
          q: "What if there's a problem with my order?",
          a: "Report issues within 7 days of delivery through the dispute system in your dashboard. BixiRoad investigates using verification records and mediates resolution. Escrow funds remain held during disputes."
        },
        {
          q: "Can I request more information about a product?",
          a: "Yes! Use the inquiry form on product pages. BixiRoad mediates communication and relays your questions to sellers, ensuring accurate responses."
        }
      ]
    },
    {
      category: "Verification & Quality",
      questions: [
        {
          q: "Who verifies the products?",
          a: "Internationally certified assayers, gemologists, and metallurgists with recognized credentials and years of experience in mineral authentication."
        },
        {
          q: "What testing equipment do you use?",
          a: "XRF analyzers for elemental composition, spectrometers for purity testing, precision scales for weight verification, and visual inspection tools for quality assessment."
        },
        {
          q: "What information is in verification reports?",
          a: "Purity percentage, weight measurements, quality grade, origin confirmation, assayer notes, testing methodology, and certification stamp."
        },
        {
          q: "Do you test for conflict minerals?",
          a: "Yes. All sellers must prove legitimate mining operations with valid licenses. We verify origin and ensure compliance with international ethical sourcing standards."
        }
      ]
    },
    {
      category: "Payments & Fees",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "Major credit/debit cards, bank transfers, and secure payment gateways. All payments are processed through encrypted, PCI-compliant systems."
        },
        {
          q: "Is there a buyer fee?",
          a: "No. Buyers pay the listed product price. The 7.5% commission is deducted from seller proceeds."
        },
        {
          q: "Are there additional costs for buyers?",
          a: "International shipping is included in the transaction. However, import duties, taxes, and fees imposed by your country are your responsibility."
        },
        {
          q: "How secure are payments?",
          a: "All payments use bank-level encryption and are held in escrow by BixiRoad. Funds only release to sellers after buyer confirmation, protecting both parties."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "Which countries do you ship to?",
          a: "We ship globally to most countries. Some countries with trade sanctions or import restrictions may be excluded."
        },
        {
          q: "How are products packaged?",
          a: "Securely packaged in tamper-evident containers with protective materials, insured, and labeled according to international shipping standards."
        },
        {
          q: "Can I track my shipment?",
          a: "Yes. Tracking information is provided in your dashboard as soon as BixiRoad ships your order from the Verification Hub."
        },
        {
          q: "What if my package is lost or damaged?",
          a: "All shipments are fully insured. If loss or damage occurs during shipping (under BixiRoad's control), we'll process a full refund or replacement."
        }
      ]
    },
    {
      category: "Legal & Compliance",
      questions: [
        {
          q: "Is BixiRoad legal?",
          a: "Yes. BixiRoad operates in full compliance with international trade laws, export regulations, and ethical sourcing standards. All sellers must have valid mining licenses."
        },
        {
          q: "Do you allow conflict minerals?",
          a: "Absolutely not. Zero tolerance policy. All products are verified for legitimate origin and compliance with conflict-free sourcing standards."
        },
        {
          q: "What about export/import regulations?",
          a: "BixiRoad handles all export documentation and customs clearance. We ensure compliance with both origin country export laws and destination country import requirements."
        },
        {
          q: "Are there restricted materials?",
          a: "Yes. Radioactive materials (uranium) require special licenses and pre-approval. Products from sanctioned countries cannot be traded. Cultural heritage items need special permits."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about trading on BixiRoad
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg border-2 focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-[#D4AF37] rounded"></span>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <Card
                      key={qIndex}
                      className="border-2 border-gray-200 hover:border-[#D4AF37] transition-all cursor-pointer"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg text-[#1A1A1A] flex-1">
                            {faq.q}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        {isOpen && (
                          <p className="mt-4 text-gray-700 leading-relaxed">
                            {faq.a}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F4E4BC]/10 border-2 border-[#D4AF37]/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-700 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@bixiroad.com" className="text-[#D4AF37] font-semibold hover:underline">
                  📧 support@bixiroad.com
                </a>
                <span className="hidden sm:block text-gray-400">|</span>
                <a href="mailto:info@bixiroad.com" className="text-[#D4AF37] font-semibold hover:underline">
                  📞 Contact Form
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}