import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Globe, FileText, Clock, Shield, MapPin } from "lucide-react";

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-[#1A1A1A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Shipping & Delivery Information</h1>
          <p className="text-lg text-gray-600">
            BixiRoad handles all international shipping from our Verification Hub to buyers worldwide
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8 border-2 border-[#D4AF37]/20">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-12 h-12 text-[#D4AF37] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">Our Shipping Promise</h2>
                <p className="text-gray-700 leading-relaxed">
                  We take full responsibility for safe, secure, and compliant international delivery. 
                  Every shipment is insured, tracked, and accompanied by complete documentation. 
                  You can trust that your authentic minerals will arrive safely.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* For Sellers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">For Sellers: Shipping to Verification Hub</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                Our Verification Hub Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#D4AF37]/10 p-6 rounded-lg border-2 border-[#D4AF37]/20">
                <p className="font-semibold text-[#1A1A1A] mb-2">BixiRoad Verification Hub</p>
                <p className="text-gray-700 mb-1">[Address Line 1]</p>
                <p className="text-gray-700 mb-1">[Address Line 2]</p>
                <p className="text-gray-700 mb-1">[City, Region, Postal Code]</p>
                <p className="text-gray-700">[Country]</p>
                <p className="text-sm text-gray-600 mt-4 italic">
                  * Specific shipping address provided after your listing is approved
                </p>
              </div>
              
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-[#1A1A1A]">Shipping Requirements:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Package securely to prevent damage during transit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Include your listing reference number inside package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Use a trackable shipping service (recommended: DHL, FedEx, UPS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Upload tracking number to your dashboard immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Insure shipment for product value (optional but recommended)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                Domestic Shipping Timeframes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <p><strong>Within same country:</strong> 2-5 business days</p>
                <p><strong>Regional African shipping:</strong> 5-10 business days</p>
                <p className="text-sm text-gray-600 italic">
                  Note: These are estimates. Actual time may vary based on your location and shipping service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* For Buyers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">For Buyers: International Delivery</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D4AF37]" />
                International Shipping Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">Processing & Packaging</h4>
                    <p className="text-sm text-gray-600">1-2 business days after purchase</p>
                    <p className="text-gray-700 mt-1">We prepare your verified product with secure, tamper-evident packaging and insurance.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">Export Documentation</h4>
                    <p className="text-sm text-gray-600">Included automatically</p>
                    <p className="text-gray-700 mt-1">We generate all necessary export certificates, customs declarations, and compliance documents.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">International Transit</h4>
                    <p className="text-sm text-gray-600">7-21 business days (varies by destination)</p>
                    <p className="text-gray-700 mt-1">Shipment departs from our hub with full tracking. You'll receive tracking number and updates.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">Customs Clearance</h4>
                    <p className="text-sm text-gray-600">Handled by us with your country's customs</p>
                    <p className="text-gray-700 mt-1">Our documentation ensures smooth customs processing. You may be contacted for import duty payment.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">Final Delivery</h4>
                    <p className="text-sm text-gray-600">To your doorstep</p>
                    <p className="text-gray-700 mt-1">Local courier delivers to your specified address. Signature may be required for high-value items.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                Estimated Delivery Times by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-800">Africa (Regional)</span>
                  <span className="text-gray-600">7-14 business days</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-800">Europe</span>
                  <span className="text-gray-600">10-15 business days</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-800">North America</span>
                  <span className="text-gray-600">12-18 business days</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-800">Asia</span>
                  <span className="text-gray-600">10-16 business days</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-800">Middle East</span>
                  <span className="text-gray-600">12-20 business days</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-800">Australia/Oceania</span>
                  <span className="text-gray-600">14-21 business days</span>
                </div>
                <p className="text-sm text-gray-600 italic mt-4">
                  * Times are estimates. Customs clearance may add 2-7 days depending on country regulations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                Import Duties & Customs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-[#1A1A1A]">Buyer Responsibility:</p>
                <p>Import duties, taxes, and customs fees imposed by your destination country are <strong>your responsibility as the buyer</strong>. These vary widely by country and product type.</p>
                
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important Note:</p>
                  <p className="text-sm text-yellow-800">
                    BixiRoad provides all necessary documentation, but we cannot predict or pay import duties on your behalf. 
                    Check with your country's customs authority for applicable rates before purchasing.
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-[#1A1A1A] mb-2">We Provide:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Commercial invoice</li>
                    <li>• Certificate of origin</li>
                    <li>• Export permit from source country</li>
                    <li>• Assay/verification reports</li>
                    <li>• Harmonized System (HS) codes for customs classification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#D4AF37]" />
                Tracking Your Shipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <p>Once your order ships from our Verification Hub, you'll receive:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Email notification with tracking number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Real-time tracking updates in your dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Estimated delivery date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Customs clearance status updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>Delivery confirmation notification</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insurance & Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              Insurance & Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <p className="font-semibold text-[#1A1A1A]">All BixiRoad shipments are fully insured:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Loss Protection:</strong> Full refund if package is lost during transit under our control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Damage Coverage:</strong> Replacement or refund if product arrives damaged</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Theft Protection:</strong> Coverage for theft during shipping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Escrow Safety:</strong> Funds held until you confirm safe delivery</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Issues & Support */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Issues & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <p className="font-semibold text-[#1A1A1A]">What if something goes wrong?</p>
              <p>Contact us immediately if:</p>
              <ul className="space-y-1 mb-4">
                <li>• Shipment is significantly delayed beyond estimated date</li>
                <li>• Tracking shows unusual status or no updates for 7+ days</li>
                <li>• Package arrives damaged or tampered with</li>
                <li>• Product doesn't match listing description</li>
              </ul>
              
              <div className="bg-[#D4AF37]/10 p-4 rounded-lg">
                <p className="font-semibold text-[#1A1A1A] mb-2">📧 Shipping Support:</p>
                <p className="text-sm">Email: <a href="mailto:shipping@bixiroad.com" className="text-[#D4AF37] hover:underline">shipping@bixiroad.com</a></p>
                <p className="text-sm">Response time: Within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}