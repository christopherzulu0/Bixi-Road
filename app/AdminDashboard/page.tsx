'use client'

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Package, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Shield,
  TrendingUp,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

// Static data
const allUsers = [
  {
    id: "user-1",
    full_name: "John Miner",
    email: "john@example.com",
    country: "Ghana",
    phone: "+233 123 456 789",
    mine_location: "Ashanti Region",
    bio: "Experienced gold miner with 15 years in the industry",
    verification_status: "pending",
    is_verified_miner: false,
    mining_license_url: "https://example.com/license.pdf",
    id_document_url: "https://example.com/id.pdf",
    company_cert_url: null
  },
  {
    id: "user-2",
    full_name: "Jane Trader",
    email: "jane@example.com",
    country: "Kenya",
    phone: "+254 987 654 321",
    mine_location: "Nairobi",
    bio: "Diamond trader specializing in export",
    verification_status: "approved",
    is_verified_miner: true
  }
];

const allProducts = [
  {
    id: "prod-1",
    title: "Premium Gold Nuggets",
    category: "Gold",
    seller_name: "John Miner",
    price_per_unit: 1850,
    unit: "grams",
    quantity: 100,
    status: "pending_approval"
  },
  {
    id: "prod-2",
    title: "Raw Diamonds",
    category: "Diamond",
    seller_name: "Jane Trader",
    price_per_unit: 2500,
    unit: "carats",
    quantity: 50,
    status: "active",
    image_urls: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"]
  }
];

const allTransactions = [
  {
    id: "txn-1",
    transaction_id: "TXN-12345-ABCDE",
    product_title: "Premium 24K Gold Nuggets",
    buyer_name: "Buyer One",
    seller_name: "John Miner",
    total_amount: 3700,
    commission_amount: 277.5,
    seller_receives: 3422.5,
    escrow_status: "completed",
    created_date: new Date(2024, 0, 15).toISOString()
  },
  {
    id: "txn-2",
    transaction_id: "TXN-12346-FGHIJ",
    product_title: "Raw Diamond Crystals",
    buyer_name: "Buyer Two",
    seller_name: "Jane Trader",
    total_amount: 12500,
    commission_amount: 937.5,
    seller_receives: 11562.5,
    escrow_status: "completed",
    created_date: new Date(2024, 0, 10).toISOString()
  }
];

export default function AdminDashboardPage() {
  const navigate = useRouter();
  const [countryFilter, setCountryFilter] = useState("all");

  const filteredUsers = countryFilter === "all" 
    ? allUsers 
    : allUsers.filter(u => u.country === countryFilter);

  const filteredProducts = countryFilter === "all"
    ? allProducts
    : allProducts.filter(p => p.country === countryFilter);

  const pendingVerifications = filteredUsers.filter(u => u.verification_status === 'pending');
  const pendingProducts = filteredProducts.filter(p => p.status === 'pending_approval');

  const handleApproveUser = async (userId) => {
    alert(`User ${userId} approved successfully`);
  };

  const handleRejectUser = async (userId) => {
    alert(`User ${userId} rejected`);
  };

  const handleApproveProduct = async (productId) => {
    alert(`Product ${productId} approved successfully`);
  };

  const handleRejectProduct = async (productId) => {
    alert(`Product ${productId} rejected`);
  };

  // Calculate stats
  const stats = {
    totalUsers: filteredUsers.length,
    verifiedMiners: filteredUsers.filter(u => u.is_verified_miner).length,
    pendingVerifications: pendingVerifications.length,
    totalListings: filteredProducts.length,
    activeListings: filteredProducts.filter(p => p.status === 'active').length,
    pendingListings: pendingProducts.length,
    totalTransactions: allTransactions.length,
    completedTransactions: allTransactions.filter(t => t.escrow_status === 'completed').length,
    totalRevenue: allTransactions
      .filter(t => t.escrow_status === 'completed')
      .reduce((sum, t) => sum + (t.total_amount || 0), 0),
    totalCommission: allTransactions
      .filter(t => t.escrow_status === 'completed')
      .reduce((sum, t) => sum + (t.commission_amount || 0), 0)
  };

  // Get unique countries
  const countries = ["all", ...new Set(allUsers.map(u => u.country).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage platform operations and oversee transactions
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate.push("/CreateArticle")}
                className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Article
              </Button>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alert for pending items */}
          {(pendingVerifications.length > 0 || pendingProducts.length > 0) && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Action Required</p>
                <p className="text-sm text-yellow-800">
                  {pendingVerifications.length > 0 && `${pendingVerifications.length} pending seller verification${pendingVerifications.length > 1 ? 's' : ''}`}
                  {pendingVerifications.length > 0 && pendingProducts.length > 0 && ' • '}
                  {pendingProducts.length > 0 && `${pendingProducts.length} pending product approval${pendingProducts.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Users</span>
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.verifiedMiners} verified miners</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Listings</span>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.activeListings}</p>
              <p className="text-xs text-gray-500 mt-1">of {stats.totalListings} total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Transactions</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.completedTransactions}</p>
              <p className="text-xs text-gray-500 mt-1">of {stats.totalTransactions} completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Commission Revenue</span>
                <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#D4AF37]">
                ${stats.totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">from ${stats.totalRevenue.toLocaleString()} sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verifications" className="relative">
              Pending Verifications
              {pendingVerifications.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{pendingVerifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products" className="relative">
              Product Approvals
              {pendingProducts.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{pendingProducts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Pending Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>Pending Seller Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingVerifications.length > 0 ? (
                  <div className="space-y-4">
                    {pendingVerifications.map((user) => (
                      <Card key={user.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-[#1A1A1A]">{user.full_name}</h3>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Pending Review
                                </Badge>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600">Country:</span>
                                  <span className="ml-2 font-semibold">{user.country}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="ml-2 font-semibold">{user.phone}</span>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="text-gray-600">Mine Location:</span>
                                  <span className="ml-2 font-semibold">{user.mine_location}</span>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="text-gray-600">Bio:</span>
                                  <p className="mt-1 text-gray-700">{user.bio}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">Documents:</p>
                                <div className="flex flex-wrap gap-2">
                                  {user.mining_license_url && (
                                    <a href={user.mining_license_url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Mining License
                                      </Button>
                                    </a>
                                  )}
                                  {user.id_document_url && (
                                    <a href={user.id_document_url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        ID Document
                                      </Button>
                                    </a>
                                  )}
                                  {user.company_cert_url && (
                                    <a href={user.company_cert_url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Company Cert
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex lg:flex-col gap-3 lg:w-40">
                              <Button
                                onClick={() => handleApproveUser(user.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectUser(user.id)}
                                variant="outline"
                                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending verifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Approvals Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Pending Product Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingProducts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingProducts.map((product) => (
                      <Card key={product.id} className="border-2">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={product.image_urls?.[0] || "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-yellow-500">Pending</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-[#1A1A1A] mb-2 line-clamp-1">
                            {product.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <p>Category: <span className="font-semibold">{product.category}</span></p>
                            <p>Seller: <span className="font-semibold">{product.seller_name}</span></p>
                            <p>Price: <span className="font-semibold text-[#D4AF37]">${product.price_per_unit}/{product.unit}</span></p>
                            <p>Quantity: <span className="font-semibold">{product.quantity} {product.unit}</span></p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveProduct(product.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectProduct(product.id)}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            // onClick={() => navigate(`${createPageUrl("ProductDetail")}?id=${product.id}`)}
                            className="w-full mt-2"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending product approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {allTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {allTransactions.slice(0, 10).map((transaction) => (
                      <Card key={transaction.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1A1A1A] mb-2">
                                {transaction.product_title}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Transaction ID: <span className="font-mono">{transaction.transaction_id}</span></p>
                                <p>Buyer: <span className="font-semibold">{transaction.buyer_name}</span></p>
                                <p>Seller: <span className="font-semibold">{transaction.seller_name}</span></p>
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
                              <div className="mt-3 space-y-1 text-sm">
                                <p className="text-gray-600">Total: <span className="font-bold text-[#1A1A1A]">${transaction.total_amount.toLocaleString()}</span></p>
                                <p className="text-gray-600">Commission: <span className="font-bold text-[#D4AF37]">${transaction.commission_amount.toLocaleString()}</span></p>
                                <p className="text-gray-600">Seller Gets: <span className="font-bold">${transaction.seller_receives.toLocaleString()}</span></p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
