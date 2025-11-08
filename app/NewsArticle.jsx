import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Eye, User, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

// Static article data
const article = {
  id: "article-1",
  title: "Gold Prices Surge in Q4 2024",
  category: "Market Prices",
  excerpt: "Gold prices have reached new highs as demand increases globally",
  content: `# Gold Prices Surge in Q4 2024

The gold market has seen unprecedented growth in the fourth quarter of 2024, with prices reaching new record highs. This surge is driven by several key factors:

## Market Factors

- **Global Economic Uncertainty**: Investors are turning to gold as a safe haven asset
- **Increased Demand**: Both jewelry and investment sectors are showing strong demand
- **Supply Constraints**: Mining operations are facing challenges in several key regions

## Regional Impact

African gold producers, particularly in Ghana, South Africa, and Mali, are benefiting significantly from these high prices. Small-scale miners are seeing better returns on their investments.

### What This Means for Sellers

If you're a miner or trader, this is an excellent time to:

1. Review your pricing strategies
2. Consider expanding your operations
3. Take advantage of the favorable market conditions

The trend is expected to continue into early 2025, making it a strategic time for sellers to maximize their profits.`,
  cover_image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
  image_gallery_urls: [
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop"
  ],
  youtube_video_url: null,
  author_name: "BixiRoad Team",
  views: 1250,
  created_date: new Date(2024, 0, 15).toISOString()
};

export default function NewsArticlePage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getCategoryColor = (category) => {
    const colors = {
      "Market Prices": "bg-green-100 text-green-800",
      "Mining Laws": "bg-blue-100 text-blue-800",
      "Export Procedures": "bg-purple-100 text-purple-800",
      "Trading Tips": "bg-orange-100 text-orange-800",
      "Success Stories": "bg-yellow-100 text-yellow-800",
      "Industry News": "bg-pink-100 text-pink-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else {
      videoId = url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const galleryImages = article.image_gallery_urls && article.image_gallery_urls.length > 0 
    ? article.image_gallery_urls 
    : [];

  const youtubeEmbedUrl = getYouTubeEmbedUrl(article.youtube_video_url);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("News"))}
          className="mb-6 text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        {/* Cover Image */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={article.cover_image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Badge className={`${getCategoryColor(article.category)} border-0 font-semibold mb-3`}>
              {article.category}
            </Badge>
          </div>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{article.author_name || "BixiRoad Team"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(new Date(article.created_date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{article.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* YouTube Video Embed */}
        {youtubeEmbedUrl && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <iframe
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[#1A1A1A] mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#1A1A1A] mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[#1A1A1A] mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-[#1A1A1A]" {...props} />,
              a: ({node, ...props}) => <a className="text-[#D4AF37] hover:underline" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-[#D4AF37] pl-4 py-2 my-4 italic text-gray-600" {...props} />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Image Gallery */}
        {galleryImages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Photo Gallery</h2>
            
            {/* Main Gallery Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-xl">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-[#1A1A1A]" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' 
                        : 'border-transparent hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#D4AF37]/10 to-[#F4E4BC]/10 rounded-xl border-2 border-[#D4AF37]/20">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
            Ready to Start Trading?
          </h3>
          <p className="text-gray-700 mb-6">
            Join Africa's most trusted marketplace for raw materials and precious minerals.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate(createPageUrl("Marketplace"))}
              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
            >
              Browse Marketplace
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("BecomeASeller"))}
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
