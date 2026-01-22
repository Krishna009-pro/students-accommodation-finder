import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { amenityIcons } from "@/lib/data";
import { PropertyDetailSkeleton } from "@/components/Skeleton";
import { AIInsightCard } from "@/components/AIInsightCard";
import { ReviewCard } from "@/components/ReviewCard";
import { useCompare } from "@/contexts/CompareContext";
import { useProperty, useReviews } from "@/hooks/useProperties";
import { PropertyMap } from "@/components/PropertyMap";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(id);
  const { data: reviews = [] } = useReviews(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCompare, isInCompare, compareList } = useCompare();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { currentUser } = useAuth();

  const isFav = property ? isFavorite(property.id) : false;

  const inCompare = property ? isInCompare(property.id) : false;

  if (!property && !isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const getSentimentText = (score: number) => {
    if (score >= 80) return { text: "Highly Recommended", color: "text-success" };
    if (score >= 60) return { text: "Good Choice", color: "text-warning" };
    return { text: "Mixed Reviews", color: "text-destructive" };
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gradient-hero">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {isLoading ? (
          <PropertyDetailSkeleton />
        ) : property ? (
          <>
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8"
            >
              <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                {/* Main Image */}
                <div className="col-span-4 md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full shadow-lg hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full shadow-lg hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-background/80 px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`hidden md:block aspect-video relative overflow-hidden ${index === currentImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>

              {/* Top Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => {
                    if (!currentUser) return; // or toast please login
                    if (isFav && property) removeFavorite(property.id);
                    else if (property) addFavorite(property);
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${isFav ? "fill-destructive text-destructive" : ""}`}
                  />
                </Button>
                <Button variant="glass" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {property.isVerified && (
                          <Badge variant="verified" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="roomType">
                          {property.roomType.charAt(0).toUpperCase() + property.roomType.slice(1)} Room
                        </Badge>
                        {property.hasMess && (
                          <Badge variant="mess" className="gap-1">
                            <UtensilsCrossed className="w-3 h-3" />
                            Mess Included
                          </Badge>
                        )}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {property.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-warning text-warning" />
                      <span className="font-semibold">{property.rating}</span>
                      <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span>{property.walkTime} min walk to campus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Available from {property.availableFrom}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h2 className="font-semibold text-lg mb-3">About This Place</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>

                  {/* Sentiment Score */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Student Satisfaction</span>
                      <span className={`font-semibold ${getSentimentText(property.sentimentScore).color}`}>
                        {getSentimentText(property.sentimentScore).text}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${property.sentimentScore >= 80
                          ? "bg-success"
                          : property.sentimentScore >= 60
                            ? "bg-warning"
                            : "bg-destructive"
                          }`}
                        style={{ width: `${property.sentimentScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h2 className="font-semibold text-lg mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                      >
                        <span className="text-xl">{amenityIcons[amenity] || "✨"}</span>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">Reviews ({reviews.length})</h2>
                    <Link to={`/property/${property.id}/review`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Write Review
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Price Card */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-card sticky top-24">
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gradient-primary">
                      ${property.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button variant="hero" className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Landlord
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant={inCompare ? "success" : "compare"}
                      className="w-full"
                      size="lg"
                      onClick={() => property && addToCompare(property)}
                      disabled={inCompare || compareList.length >= 3}
                    >
                      {inCompare ? "Added to Compare" : "Add to Compare"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>🔒 Secure booking • No hidden fees</p>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="relative">
                  <div className="relative">
                    {property.aiInsights && property.aiInsights.length > 0 && (
                      <div className="mb-4">
                        <AIInsightCard insights={property.aiInsights} />
                      </div>
                    )}

                    <div className="bg-card rounded-2xl p-6 border border-border text-center">
                      <h3 className="font-semibold mb-2">
                        {property.aiInsights && property.aiInsights.length > 0 ? "Update Insights" : "AI-Powered Insights"}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {property.aiInsights && property.aiInsights.length > 0
                          ? "Refresh the insights with the latest data using Gemini AI."
                          : "Get personalized insights about this property using Gemini AI."}
                      </p>
                      <Button
                        variant={property.aiInsights && property.aiInsights.length > 0 ? "outline" : "hero"}
                        onClick={async () => {
                          if (!currentUser) return toast.error("Please login to generate insights");
                          try {
                            toast.loading("Generating insights...");
                            const token = localStorage.getItem('token');
                            const res = await fetch('http://localhost:5001/api/ai/insights', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ property })
                            });

                            const data = await res.json();
                            if (data.error) throw new Error(data.error);

                            // Optimistically update the UI (in real app, use React Query mutation)
                            property.aiInsights = data.insights;
                            toast.dismiss();
                            toast.success("Insights generated!");
                            // Force re-render (hacky but works for now without complex state refactor)
                            window.location.reload();
                          } catch (err: any) {
                            toast.dismiss();
                            toast.error(err.message || "Failed to generate insights");
                          }
                        }}
                      >
                        {property.aiInsights && property.aiInsights.length > 0 ? "Regenerate ✨" : "Generate with Gemini ✨"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Map View */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Location</h3>
                    <span className="text-xs text-muted-foreground">{property.distance} from campus</span>
                  </div>
                  <div className="h-[300px] overflow-hidden rounded-xl border border-border">
                    <PropertyMap
                      properties={[property]}
                      center={[property.coordinates.lat, property.coordinates.lng]}
                      zoom={15}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyDetail;
