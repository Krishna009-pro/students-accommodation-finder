import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  Plus,
  Check,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Property, amenityIcons } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";

interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list";
}

export const PropertyCard = ({ property, variant = "grid" }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const { isFavorite, addFavorite, removeFavorite, isAdding, isRemoving } = useFavorites();
  const { currentUser } = useAuth();

  const inCompare = isInCompare(property.id);
  const isFav = isFavorite(property.id);
  const isLoading = isAdding || isRemoving;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      // Hook handles toast error for unauth, or we can toast here
      return;
    }
    if (isFav) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const isGrid = variant === "grid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 ${isGrid ? "" : "flex"
        }`}
    >
      <Link to={`/property/${property.id}`} className={isGrid ? "" : "flex w-full"}>
        {/* Image Section */}
        <div className={`relative ${isGrid ? "aspect-[4/3]" : "w-72 shrink-0"} overflow-hidden`}>
          <img
            src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : "/placeholder.jpg"}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {property.images && property.images.length > 1 && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images?.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-primary-foreground" : "bg-primary-foreground/40"
                  }`}
              />
            ))}
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.isVerified && (
              <Badge variant="verified" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isFav ? "fill-destructive text-destructive" : "text-foreground"
                }`}
            />
          </button>

          {/* Sentiment Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className={`h-full ${getSentimentColor(property.sentimentScore)}`}
              style={{ width: `${property.sentimentScore}%` }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-4 flex-1 ${isGrid ? "" : "flex flex-col"}`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-muted-foreground text-sm">({property.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="distance" className="gap-1">
              <Clock className="w-3 h-3" />
              {property.walkTime} min walk
            </Badge>
            <Badge variant="roomType">
              {property.roomType ? property.roomType.charAt(0).toUpperCase() + property.roomType.slice(1) : "Room"}
            </Badge>
            {property.hasMess && (
              <Badge variant="mess" className="gap-1">
                <UtensilsCrossed className="w-3 h-3" />
                Mess
              </Badge>
            )}
          </div>

          {/* Amenities Preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-muted px-2 py-1 rounded-md"
                title={amenity}
              >
                {amenityIcons[amenity] || "✨"} {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between ${isGrid ? "" : "mt-auto"}`}>
            <div>
              <span className="text-2xl font-bold text-gradient-primary">
                ₹{property.price}
              </span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <Button
              variant={inCompare ? "success" : "compare"}
              size="sm"
              onClick={handleCompareClick}
              disabled={!inCompare && compareList.length >= 3}
              className="gap-1"
            >
              {inCompare ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Compare
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
