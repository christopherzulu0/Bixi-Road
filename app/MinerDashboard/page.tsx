'use client'

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  DollarSign,
  Eye,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

// Static data
const user = {
  id: "user-1",
  full_name: "John Miner",
  country: "Ghana",
  rating_average: 4.5,
  total_reviews: 23,
  total_sales: 15
};

const products = [
  {
    id: "prod-1",
    title: "Premium 24K Gold Nuggets",
    status: "active",
    price_per_unit: 1850,
    unit: "grams",
    quantity: 100,
    views: 342,
    image_urls: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"]
  },
  {
    id: "prod-2",
    title: "Raw Diamond Crystals",
    status: "pending_approval",
    price_per_unit: 2500,
    unit: "carats",
    quantity: 50,
    views: 0,
    image_urls: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"]
  }
];

const transactions = [
  {
    id: "txn-1",
    product_title: "Premium 24K Gold Nuggets",
    buyer_name: "Buyer One",
    quantity: 2,
    unit_price: 1850,
    seller_receives: 3422.5,
    escrow_status: "completed",
    created_date: new Date(2024, 0, 15).toISOString()
  },
  {
    id: "txn-2",
    product_title: "Gold Ore",
    buyer_name: "Buyer Two",
    quantity: 5,
    unit_price: 1500,
    seller_receives: 6937.5,
    escrow_status: "shipped",
    created_date: new Date(2024, 0, 20).toISOString()
  }
];

const inquiries = [
  {
    id: "inq-1",
    product_title: "Premium 24K Gold Nuggets",
    buyer_name: "Potential Buyer",
    message: "What is the purity level of these nuggets?",
    status: "pending",
    created_date: new Date(2024, 0, 22).toISOString()
  },
  {
    id: "inq-2",
    product_title: "Raw Diamond Crystals",
    buyer_name: "Diamond Trader",
    message: "Do you have certificates for these?",
    status: "responded",
    response: "Yes, we have full certification documents.",
    created_date: new Date(2024, 0, 18).toISOString()
  }
];

export default function MinerDashboardPage() {
  const router = useRouter();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      alert(`Product ${productId} deleted successfully`);
    }
  };

  const handleRespond = (inquiryId: string) => {
    alert(`Response sent for inquiry ${inquiryId}`);
    setRespondingTo(null);
    setResponse("");
  };

  const stats = {
    totalListings: products.length,
    activeListings: products.filter(p => p.status === 'active').length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
    totalInquiries: inquiries.length,
    totalSales: transactions.filter(t => t.escrow_status === 'completed').length,
    totalRevenue: transactions
      .filter(t => t.escrow_status === 'completed')
      .reduce((sum, t) => sum + (t.seller_receives || 0), 0),
    pendingTransactions: transactions.filter(t => ['funds_held', 'shipped'].includes(t.escrow_status)).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
                Seller Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage your listings and track your sales
              </p>
            </div>
            <Button
              onClick={() => router.push("/create-listing")}
              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Listing
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Listings</span>
                <Package className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.activeListings}</p>
              <p className="text-xs text-gray-500 mt-1">of {stats.totalListings} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Views</span>
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalViews}</p>
              <p className="text-xs text-gray-500 mt-1">across all listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completed Sales</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalSales}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.pendingTransactions} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#D4AF37]">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">after commission</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Performance */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Your Profile Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A]">
                  {user.full_name?.[0] || 'M'}
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">{user.full_name}</p>
                  <p className="text-sm text-gray-600">{user.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 fill-[#D4AF37] text-[#D4AF37]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    {user.rating_average?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-gray-600">{user.total_reviews || 0} reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    {user.total_sales || 0}
                  </p>
                  <p className="text-sm text-gray-600">successful sales</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">My Listings ({products.length})</TabsTrigger>
            <TabsTrigger value="inquiries">
              Inquiries ({inquiries.filter(i => i.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">My Listings</h2>

            {products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image_urls?.[0] || "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={
                          product.status === 'active' ? 'bg-green-500' :
                            product.status === 'pending_approval' ? 'bg-yellow-500' :
                              'bg-gray-500'
                        }>
                          {product.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-[#1A1A1A] mb-2 line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-semibold text-[#D4AF37]">
                            ${product.price_per_unit}/{product.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-semibold">{product.quantity} {product.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span className="font-semibold">{product.views || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/edit-listing?id=${product.id}`)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                  <Card className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Create your first listing to start selling</p>
                <Button
                  onClick={() => router.push("/create-listing")}
                  className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Product Inquiries</h2>

            {inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id} className={inquiry.status === 'pending' ? 'border-2 border-yellow-300' : ''}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] mb-1">{inquiry.product_title}</h3>
                          <p className="text-sm text-gray-600">
                            From: <span className="font-medium">{inquiry.buyer_name}</span>
                          </p>
                          <p className="text-xs text-gray-500">{format(new Date(inquiry.created_date), "MMM d, yyyy 'at' h:mm a")}</p>
                        </div>
                        <Badge className={
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                        }>
                          {inquiry.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Question:</p>
                        <p className="text-gray-800">{inquiry.message}</p>
                      </div>

                      {inquiry.response ? (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-green-900 mb-1">Your Response:</p>
                          <p className="text-green-800">{inquiry.response}</p>
                        </div>
                      ) : respondingTo === inquiry.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response..."
                            rows={4}
                            className="resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRespond(inquiry.id)}
                              disabled={!response.trim()}
                              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                            >
                              Send Response
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponse("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setRespondingTo(inquiry.id)}
                          className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respond to Inquiry
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No inquiries yet</h3>
                <p className="text-gray-600">Buyer questions will appear here</p>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Recent Transactions</h2>

            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] mb-2">
                            {transaction.product_title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Buyer: <span className="font-medium">{transaction.buyer_name}</span></p>
                            <p>Quantity: {transaction.quantity} @ ${transaction.unit_price}</p>
                            <p>Date: {format(new Date(transaction.created_date), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            transaction.escrow_status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.escrow_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                          }>
                            {transaction.escrow_status.replace(/_/g, ' ')}
                          </Badge>
                          <p className="text-2xl font-bold text-[#D4AF37] mt-2">
                            ${transaction.seller_receives?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">you receive</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No transactions yet</h3>
                <p className="text-gray-600">Your sales will appear here</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
