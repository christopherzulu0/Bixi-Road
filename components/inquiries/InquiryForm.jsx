import React, { useState, useEffect } from "react";
import { mockClient as base44 } from "@/api/mockClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Info } from "lucide-react";

export default function InquiryForm({ product }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname + window.location.search);
      return;
    }

    if (!message.trim()) {
      alert("Please enter your question");
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.entities.Inquiry.create({
        product_id: product.id,
        product_title: product.title,
        buyer_id: user.id,
        buyer_name: user.full_name || user.email,
        buyer_email: user.email,
        seller_id: product.seller_id,
        seller_name: product.seller_name,
        message: message,
        status: "pending"
      });

      // Update product inquiry count
      await base44.entities.Product.update(product.id, {
        inquiries: (product.inquiries || 0) + 1
      });

      // Create notification for seller
      await base44.entities.Notification.create({
        user_id: product.seller_id,
        type: "inquiry_received",
        title: "New Inquiry on Your Product",
        message: `${user.full_name || user.email} asked about "${product.title}"`,
        link: `/miner-dashboard?tab=inquiries`
      });

      setSubmitted(true);
      setMessage("");
    } catch (error) {
      alert("Error sending inquiry. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            Ask About This Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Please sign in to send an inquiry about this product.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => base44.auth.redirectToLogin(window.location.pathname + window.location.search)}
            className="w-full mt-4 bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
          >
            Sign In to Inquire
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user.id === product.seller_id) {
    return null; // Don't show inquiry form to seller on their own product
  }

  if (submitted) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-green-900 mb-2">Inquiry Sent Successfully!</h3>
              <p className="text-sm text-green-800 mb-3">
                BixiRoad will forward your question to the seller and notify you when they respond. 
                You'll receive an email notification.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="border-green-600 text-green-600 hover:bg-green-100"
              >
                Send Another Question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          Ask About This Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="w-4 h-4" />
          <AlertDescription className="text-sm">
            All inquiries are mediated by BixiRoad. We'll forward your question to the seller and notify you when they respond.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about purity, quantity, shipping, or any other details..."
            rows={4}
            required
            className="resize-none"
          />
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
          >
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}