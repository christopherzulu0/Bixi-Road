'use client'

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Info } from "lucide-react";

type Product = {
  id: string;
  title: string;
  seller?: {
    id?: string;
    full_name: string;
    country: string;
  };
};

type InquiryFormProps = {
  product: Product;
};

export default function InquiryForm({ product }: InquiryFormProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!message.trim()) {
      alert("Please enter your question");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmitted(true);
      setMessage("");
    } catch (error) {
      console.error("Inquiry error:", error);
      alert(error instanceof Error ? error.message : "Error sending inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show form until Clerk is loaded
  if (!isLoaded) {
    return null;
  }

  // Check if user is the seller (hide form if they are)
  const [isSeller, setIsSeller] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn && user && product.seller?.id) {
      // Fetch user's database ID to check if they're the seller
      fetch("/api/users/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.id && product.seller?.id) {
            setIsSeller(data.id === product.seller.id);
          } else {
            setIsSeller(false);
          }
        })
        .catch(() => setIsSeller(false));
    } else {
      setIsSeller(false);
    }
  }, [isSignedIn, user, product.seller?.id]);

  // Don't show form while checking or if user is the seller
  if (isSeller === null) {
    return null;
  }

  if (isSeller) {
    return null; // Don't show inquiry form to seller on their own product
  }

  if (!isSignedIn) {
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
            onClick={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
            className="w-full mt-4 bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
          >
            Sign In to Inquire
          </Button>
        </CardContent>
      </Card>
    );
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