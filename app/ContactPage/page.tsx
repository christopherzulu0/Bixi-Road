'use client'

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  CheckCircle,
  MessageSquare,
  Clock,
  Globe
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "general", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      setError(error instanceof Error ? error.message : "Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@bixiroad.com",
      subtext: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      subtext: "Mon-Fri, 9AM - 6PM GMT"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Accra, Ghana",
      subtext: "West Africa Regional Office"
    },
    {
      icon: Globe,
      title: "Operating Hours",
      content: "24/7 Platform",
      subtext: "Support: Mon-Fri 9AM-6PM GMT"
    }
  ];

  const faqItems = [
    {
      question: "How do I become a verified seller?",
      answer: "Click 'Become a Seller' and submit your mining license, ID, and business details for verification."
    },
    {
      question: "How does escrow protection work?",
      answer: "Your payment is held securely until you confirm delivery. Sellers ship knowing payment is guaranteed."
    },
    {
      question: "What documents do I need for verification?",
      answer: "Mining license/permit, government ID or passport, and optionally company registration certificate."
    },
    {
      question: "How long does verification take?",
      answer: "Typically 3-5 business days. We'll notify you via email once complete."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-[#1A1A1A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about trading on BixiRoad? Our team is here to help you navigate Africa's premier minerals marketplace.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="text-[#D4AF37] font-semibold mb-1">{item.content}</p>
                <p className="text-sm text-gray-600">{item.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="space-y-4">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Message sent successfully!</strong><br />
                        We've received your message and will respond within 24 hours. A confirmation email has been sent to your inbox.
                      </AlertDescription>
                    </Alert>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="w-full"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({...formData, subject: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="seller_verification">Seller Verification</SelectItem>
                          <SelectItem value="buyer_support">Buyer Support</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="complaint">Report an Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] font-semibold text-lg h-12"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-[#D4AF37]">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-[#1A1A1A] mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F4E4BC]/10 border-2 border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  Need Help Right Away?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  Check out these helpful resources:
                </p>
                <div className="space-y-2">
                  <Link href="/news" className="block text-[#D4AF37] hover:underline font-medium">
                    → Trading Safety Guide
                  </Link>
                  <Link href="/become-seller" className="block text-[#D4AF37] hover:underline font-medium">
                    → How to Become a Seller
                  </Link>
                  <Link href="/marketplace" className="block text-[#D4AF37] hover:underline font-medium">
                    → Browse Marketplace
                  </Link>
                  <Link href="/news" className="block text-[#D4AF37] hover:underline font-medium">
                    → Market News & Updates
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  Support Hours
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM GMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM GMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                  <div className="mt-4 p-3 bg-[#D4AF37]/10 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Note:</strong> The marketplace operates 24/7. Support inquiries submitted outside business hours will be addressed on the next business day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}