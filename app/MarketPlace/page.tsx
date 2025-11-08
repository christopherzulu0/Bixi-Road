'use client'

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";

// Static products data
const staticProducts = [
  {
    id: '1',
    title: 'Premium Gold Nuggets',
    description: 'High-grade gold nuggets from Ghana',
    category: 'Gold',
    price_per_unit: 65.50,
    unit: 'grams',
    quantity: 500,
    purity_grade: '24K',
    country: 'Ghana',
    image_urls: ['/placeholder-gold.jpg'],
    seller: { full_name: 'Kwame Mensah', country: 'Ghana' },
    is_featured: true,
    status: 'active',
    views: 234,
    created_date: '2024-01-15'
  },
  {
    id: '2',
    title: 'Tanzanite Gemstones',
    description: 'Rare tanzanite stones from Tanzania',
    category: 'Diamond',
    price_per_unit: 1200.00,
    unit: 'carats',
    quantity: 25,
    purity_grade: 'AAA',
    country: 'Tanzania',
    image_urls: ['/placeholder-tanzanite.jpg'],
    seller: { full_name: 'Joseph Mwangi', country: 'Tanzania' },
    is_featured: true,
    status: 'active',
    views: 189,
    created_date: '2024-01-20'
  },
  {
    id: '3',
    title: 'Raw Diamonds',
    description: 'Uncut diamonds from South Africa',
    category: 'Diamond',
    price_per_unit: 850.00,
    unit: 'carats',
    quantity: 15,
    purity_grade: 'VS1',
    country: 'South Africa',
    image_urls: ['/placeholder-diamond.jpg'],
    seller: { full_name: 'Sarah Johnson', country: 'South Africa' },
    is_featured: true,
    status: 'active',
    views: 312,
    created_date: '2024-01-10'
  },
  {
    id: '4',
    title: 'Copper Ore',
    description: 'High-grade copper ore from Zambia',
    category: 'Copper',
    price_per_unit: 4.20,
    unit: 'kg',
    quantity: 1000,
    purity_grade: '99.9%',
    country: 'Zambia',
    image_urls: ['/placeholder-copper.jpg'],
    seller: { full_name: 'David Banda', country: 'Zambia' },
    is_featured: true,
    status: 'active',
    views: 156,
    created_date: '2024-01-25'
  },
  {
    id: '5',
    title: 'Emerald Crystals',
    description: 'Natural emerald crystals from DRC',
    category: 'Emerald',
    price_per_unit: 450.00,
    unit: 'carats',
    quantity: 50,
    purity_grade: 'AA',
    country: 'DRC',
    image_urls: ['/placeholder-emerald.jpg'],
    seller: { full_name: 'Pierre Kabila', country: 'DRC' },
    is_featured: true,
    status: 'active',
    views: 278,
    created_date: '2024-01-18'
  },
  {
    id: '6',
    title: 'Silver Bars',
    description: 'Refined silver bars from Kenya',
    category: 'Gold',
    price_per_unit: 28.50,
    unit: 'grams',
    quantity: 1000,
    purity_grade: '99.9%',
    country: 'Kenya',
    image_urls: ['/placeholder-silver.jpg'],
    seller: { full_name: 'Mary Wanjiku', country: 'Kenya' },
    is_featured: true,
    status: 'active',
    views: 201,
    created_date: '2024-01-22'
  },
  {
    id: '7',
    title: 'Ruby Gemstones',
    description: 'Premium ruby stones from Tanzania',
    category: 'Ruby',
    price_per_unit: 950.00,
    unit: 'carats',
    quantity: 30,
    purity_grade: 'AAA',
    country: 'Tanzania',
    image_urls: ['/placeholder-ruby.jpg'],
    seller: { full_name: 'John Mwangi', country: 'Tanzania' },
    is_featured: false,
    status: 'active',
    views: 145,
    created_date: '2024-01-12'
  },
  {
    id: '8',
    title: 'Cobalt Ore',
    description: 'High-grade cobalt ore from DRC',
    category: 'Cobalt',
    price_per_unit: 12.50,
    unit: 'kg',
    quantity: 500,
    purity_grade: '98%',
    country: 'DRC',
    image_urls: ['/placeholder-cobalt.jpg'],
    seller: { full_name: 'Jean Kabila', country: 'DRC' },
    is_featured: false,
    status: 'active',
    views: 98,
    created_date: '2024-01-28'
  },
  {
    id: '9',
    title: 'Lithium Ore',
    description: 'Premium lithium ore from Zimbabwe',
    category: 'Lithium',
    price_per_unit: 8.75,
    unit: 'kg',
    quantity: 800,
    purity_grade: '95%',
    country: 'Zimbabwe',
    image_urls: ['/placeholder-lithium.jpg'],
    seller: { full_name: 'Robert Mugabe', country: 'Zimbabwe' },
    is_featured: false,
    status: 'active',
    views: 167,
    created_date: '2024-01-14'
  },
  {
    id: '10',
    title: 'Sapphire Gems',
    description: 'Natural sapphire gems from Nigeria',
    category: 'Sapphire',
    price_per_unit: 750.00,
    unit: 'carats',
    quantity: 20,
    purity_grade: 'AA',
    country: 'Nigeria',
    image_urls: ['/placeholder-sapphire.jpg'],
    seller: { full_name: 'Amina Hassan', country: 'Nigeria' },
    is_featured: false,
    status: 'active',
    views: 123,
    created_date: '2024-01-19'
  },
  {
    id: '11',
    title: 'Iron Ore',
    description: 'High-grade iron ore from Botswana',
    category: 'Iron Ore',
    price_per_unit: 2.50,
    unit: 'kg',
    quantity: 2000,
    purity_grade: '65%',
    country: 'Botswana',
    image_urls: ['/placeholder-iron.jpg'],
    seller: { full_name: 'Thabo Mbeki', country: 'Botswana' },
    is_featured: false,
    status: 'active',
    views: 89,
    created_date: '2024-01-16'
  },
  {
    id: '12',
    title: 'Coltan Ore',
    description: 'Premium coltan ore from DRC',
    category: 'Coltan',
    price_per_unit: 15.00,
    unit: 'kg',
    quantity: 600,
    purity_grade: '30%',
    country: 'DRC',
    image_urls: ['/placeholder-coltan.jpg'],
    seller: { full_name: 'Paul Kabila', country: 'DRC' },
    is_featured: false,
    status: 'active',
    views: 112,
    created_date: '2024-01-21'
  }
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = staticProducts.filter(product => {
      // Status filter
      if (product.status !== 'active') return false;
      
      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
      
      // Country filter
      if (countryFilter !== 'all' && product.country !== countryFilter) return false;
      
      // Search filter
      if (searchQuery !== "") {
        const query = searchQuery.toLowerCase();
        if (!product.title.toLowerCase().includes(query) && 
            !product.description?.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case '-created_date':
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
        case 'price_per_unit':
          return a.price_per_unit - b.price_per_unit;
        case '-price_per_unit':
          return b.price_per_unit - a.price_per_unit;
        case '-views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [categoryFilter, countryFilter, searchQuery, sortBy]);

  const categories = ["Gold", "Diamond", "Emerald", "Ruby", "Sapphire", "Copper", "Lithium", "Cobalt", "Coltan", "Uranium", "Iron Ore", "Bauxite", "Other Gemstone", "Other Mineral"];
  
  const countries = ["Ghana", "Kenya", "Tanzania", "Zambia", "South Africa", "DRC", "Nigeria", "Zimbabwe", "Botswana", "Mali"];

  const clearFilters = () => {
    setCategoryFilter("all");
    setCountryFilter("all");
    setSearchQuery("");
    setSortBy("-created_date");
  };

  const hasActiveFilters = categoryFilter !== "all" || countryFilter !== "all" || searchQuery !== "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Verified Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Browse authentic African minerals from certified miners
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search minerals, gemstones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-[#D4AF37]"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border-2 border-[#D4AF37] text-[#D4AF37] h-12"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 border-2 focus:border-[#D4AF37]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_date">Newest First</SelectItem>
                <SelectItem value="price_per_unit">Price: Low to High</SelectItem>
                <SelectItem value="-price_per_unit">Price: High to Low</SelectItem>
                <SelectItem value="-views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters Row */}
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4`}>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="flex-1 h-12 border-2 focus:border-[#D4AF37]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="flex-1 h-12 border-2 focus:border-[#D4AF37]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-[#1A1A1A]">{filteredProducts.length}</span> verified listings found
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]">
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}