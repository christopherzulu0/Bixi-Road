import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, AlertTriangle, Ban, CheckCircle, Scale } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#1A1A1A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Community Guidelines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Standards and rules for maintaining a safe, trustworthy, and respectful marketplace
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-2 border-[#D4AF37]/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              BixiRoad is built on trust, transparency, and ethical trade. These guidelines ensure that everyone—sellers, 
              buyers, and the BixiRoad team—operates with integrity. By using our platform, you agree to uphold these standards.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Violations of these guidelines may result in warnings, listing removal, account suspension, or permanent bans 
              depending on severity.
            </p>
          </CardContent>
        </Card>

        {/* Core Principles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Honesty</h3>
              <p className="text-sm text-gray-600">Accurate descriptions, authentic products, truthful communication</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">Honor commitments, follow through, operate ethically</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Respect</h3>
              <p className="text-sm text-gray-600">Professional conduct, courteous communication, mutual consideration</p>
            </Card>
          </div>
        </div>

        {/* For Sellers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Rules for Sellers (Miners)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Required Conduct
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Accurate Listings:</strong> Provide truthful descriptions of purity, weight, quality, and origin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Valid Documentation:</strong> Maintain current mining licenses and legal permits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Quality Photos:</strong> Use clear, representative images of actual products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Timely Shipping:</strong> Ship to Verification Hub within 3 business days of approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Responsive Communication:</strong> Reply to inquiries within 48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Professional Behavior:</strong> Maintain courteous, respectful communication at all times</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                Prohibited Actions
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Misrepresentation:</strong> False claims about purity, grade, weight, or origin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Counterfeit Products:</strong> Fake minerals, synthetic stones passed as natural, plated metals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Conflict Minerals:</strong> Products sourced from conflict zones or through illegal mining</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Document Fraud:</strong> Forged licenses, fake permits, or falsified credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Direct Contact:</strong> Attempting to bypass BixiRoad by contacting buyers directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Price Manipulation:</strong> Colluding with other sellers to fix prices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Multiple Accounts:</strong> Creating duplicate accounts to circumvent restrictions</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* For Buyers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Rules for Buyers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Expected Conduct
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Fair Treatment:</strong> Treat sellers with respect and professionalism</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Timely Confirmation:</strong> Confirm delivery within 7 days of receiving products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Honest Reviews:</strong> Leave accurate, fair reviews based on actual experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Reasonable Inquiries:</strong> Ask relevant, respectful questions about products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Legitimate Disputes:</strong> Only open disputes for genuine quality or delivery issues</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                Prohibited Actions
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Payment Fraud:</strong> Using stolen cards, chargebacks after receiving products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>False Disputes:</strong> Opening disputes without legitimate cause to avoid payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Malicious Reviews:</strong> Leaving false negative reviews to harm sellers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Direct Contact:</strong> Attempting to bypass BixiRoad by contacting sellers directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Harassment:</strong> Abusive language, threats, or inappropriate behavior toward sellers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Product Swapping:</strong> Returning different items than those received</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Items & Activities */}
        <Card className="mb-8 border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Strictly Prohibited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-900 mb-4 font-semibold">
              The following activities result in immediate permanent ban and legal action:
            </p>
            <ul className="space-y-3 text-red-900">
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Conflict Minerals:</strong> Products sourced from conflict zones, illegal mining operations, or areas controlled by armed groups</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Stolen Property:</strong> Minerals or stones obtained through theft, robbery, or illegal acquisition</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Blood Diamonds:</strong> Diamonds used to finance armed conflict or civil wars</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Child Labor:</strong> Products extracted using child labor or forced labor</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Environmental Crimes:</strong> Products from operations causing severe environmental destruction or pollution</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Money Laundering:</strong> Using the platform to launder proceeds from criminal activities</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Terrorism Financing:</strong> Any transaction linked to terrorist organizations or activities</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span><strong>Fraud & Scams:</strong> Intentional deception, bait-and-switch, Ponzi schemes, or pyramid schemes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Communication Standards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Communication Standards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              All communication through BixiRoad (inquiries, disputes, reviews) must be:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Professional:</strong> Business-appropriate language and tone</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Respectful:</strong> No insults, slurs, hate speech, or discriminatory language</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Truthful:</strong> Accurate information without exaggeration or misrepresentation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Relevant:</strong> Related to the product, transaction, or legitimate business concerns</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Zero Tolerance:</p>
              <p className="text-sm text-yellow-800">
                Harassment, threats, hate speech, sexual content, or violent language results in immediate account suspension.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enforcement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Scale className="w-6 h-6 text-[#D4AF37]" />
              Enforcement & Consequences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">Minor Violations</h3>
                <p className="text-gray-700 mb-2">Examples: Late responses, unclear photos, minor inaccuracies</p>
                <p className="text-sm text-gray-600"><strong>Action:</strong> Warning + required correction within 48 hours</p>
              </div>

              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">Moderate Violations</h3>
                <p className="text-gray-700 mb-2">Examples: Misrepresentation, multiple late shipments, unprofessional conduct</p>
                <p className="text-sm text-gray-600"><strong>Action:</strong> 7-30 day suspension + listing removal</p>
              </div>

              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">Severe Violations</h3>
                <p className="text-gray-700 mb-2">Examples: Fraud, fake documents, harassment, conflict minerals</p>
                <p className="text-sm text-gray-600"><strong>Action:</strong> Permanent ban + legal action + law enforcement referral</p>
              </div>

              <div className="mt-6 p-4 bg-[#D4AF37]/10 rounded-lg border-2 border-[#D4AF37]/20">
                <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Appeal Process:</p>
                <p className="text-sm text-gray-700">
                  Users may appeal enforcement actions by contacting appeals@bixiroad.com within 14 days. 
                  Appeals are reviewed by senior team members. Decisions on severe violations are final.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporting Violations */}
        <Card className="mb-8 border-2 border-[#D4AF37]">
          <CardHeader>
            <CardTitle className="text-2xl">Report Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you witness or experience violations of these guidelines, please report immediately:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">General Violations</p>
                  <a href="mailto:compliance@bixiroad.com" className="text-sm text-[#D4AF37] hover:underline">
                    compliance@bixiroad.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Fraud or Illegal Activity</p>
                  <a href="mailto:security@bixiroad.com" className="text-sm text-[#D4AF37] hover:underline">
                    security@bixiroad.com
                  </a>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 italic">
              All reports are confidential. BixiRoad investigates all reports thoroughly and takes appropriate action.
            </p>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-sm text-gray-600 mt-2">
              BixiRoad reserves the right to update these guidelines at any time. Users will be notified of significant changes. 
              Continued use of the platform constitutes acceptance of updated guidelines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}