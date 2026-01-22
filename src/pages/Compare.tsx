import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, Trash2, Star, Clock, DollarSign, Zap, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/contexts/CompareContext";

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const getMaxValue = (key: "price" | "rating" | "walkTime" | "sentimentScore") => {
    if (compareList.length === 0) return 0;
    return Math.max(...compareList.map((p) => p[key]));
  };

  const getMinValue = (key: "price" | "rating" | "walkTime" | "sentimentScore") => {
    if (compareList.length === 0) return 0;
    return Math.min(...compareList.map((p) => p[key]));
  };

  const isHighlighted = (value: number, key: "price" | "rating" | "walkTime" | "sentimentScore", isBetterWhenLower: boolean = false) => {
    if (compareList.length < 2) return false;
    if (isBetterWhenLower) {
      return value === getMinValue(key);
    }
    return value === getMaxValue(key);
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-hero">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">No Properties to Compare</h1>
            <p className="text-muted-foreground mb-8">
              Add properties to your compare list from the search page to see them side by side.
            </p>
            <Link to="/search">
              <Button variant="hero" size="lg">
                Browse Properties
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gradient-hero">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Compare Properties</h1>
              <p className="text-muted-foreground">{compareList.length} properties selected</p>
            </div>
          </div>
          <Button variant="outline" onClick={clearCompare} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
        >
          {/* Property Headers */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border font-semibold">
              Property
            </div>
            {compareList.map((property) => (
              <div key={property.id} className="p-4 border-b border-border relative group">
                <button
                  onClick={() => removeFromCompare(property.id)}
                  className="absolute top-2 right-2 p-1 bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full aspect-video object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{property.location}</p>
                {property.isVerified && (
                  <Badge variant="verified" className="gap-1 mt-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Price Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border flex items-center gap-2 font-medium">
              <DollarSign className="w-4 h-4 text-primary" />
              Price
            </div>
            {compareList.map((property) => (
              <div
                key={property.id}
                className={`p-4 border-b border-border ${
                  isHighlighted(property.price, "price", true) ? "bg-success/10" : ""
                }`}
              >
                <span className="text-2xl font-bold">${property.price}</span>
                <span className="text-muted-foreground">/mo</span>
                {isHighlighted(property.price, "price", true) && (
                  <Badge variant="verified" className="ml-2">Best Value</Badge>
                )}
              </div>
            ))}
          </div>

          {/* Rating Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border flex items-center gap-2 font-medium">
              <Star className="w-4 h-4 text-warning" />
              Rating
            </div>
            {compareList.map((property) => (
              <div
                key={property.id}
                className={`p-4 border-b border-border ${
                  isHighlighted(property.rating, "rating") ? "bg-success/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="text-xl font-bold">{property.rating}</span>
                  <span className="text-muted-foreground">({property.reviewCount})</span>
                </div>
                {isHighlighted(property.rating, "rating") && (
                  <Badge variant="verified" className="mt-1">Highest Rated</Badge>
                )}
              </div>
            ))}
          </div>

          {/* Walk Time Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-accent" />
              Walk to Campus
            </div>
            {compareList.map((property) => (
              <div
                key={property.id}
                className={`p-4 border-b border-border ${
                  isHighlighted(property.walkTime, "walkTime", true) ? "bg-success/10" : ""
                }`}
              >
                <span className="text-xl font-bold">{property.walkTime}</span>
                <span className="text-muted-foreground"> min</span>
                {isHighlighted(property.walkTime, "walkTime", true) && (
                  <Badge variant="verified" className="ml-2">Closest</Badge>
                )}
              </div>
            ))}
          </div>

          {/* Sentiment Score Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-primary" />
              Sentiment Score
            </div>
            {compareList.map((property) => (
              <div
                key={property.id}
                className={`p-4 border-b border-border ${
                  isHighlighted(property.sentimentScore, "sentimentScore") ? "bg-success/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                    <div
                      className={`h-full ${
                        property.sentimentScore >= 80
                          ? "bg-success"
                          : property.sentimentScore >= 60
                          ? "bg-warning"
                          : "bg-destructive"
                      }`}
                      style={{ width: `${property.sentimentScore}%` }}
                    />
                  </div>
                  <span className="font-bold">{property.sentimentScore}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Room Type Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border flex items-center gap-2 font-medium">
              Room Type
            </div>
            {compareList.map((property) => (
              <div key={property.id} className="p-4 border-b border-border">
                <Badge variant="roomType">
                  {property.roomType.charAt(0).toUpperCase() + property.roomType.slice(1)}
                </Badge>
              </div>
            ))}
          </div>

          {/* Mess Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-b border-r border-border flex items-center gap-2 font-medium">
              Mess Included
            </div>
            {compareList.map((property) => (
              <div key={property.id} className="p-4 border-b border-border">
                {property.hasMess ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Amenities Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            <div className="p-4 bg-muted/50 border-r border-border flex items-center gap-2 font-medium">
              Amenities
            </div>
            {compareList.map((property) => (
              <div key={property.id} className="p-4">
                <div className="flex flex-wrap gap-1">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs bg-muted px-2 py-1 rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 mt-8"
          style={{ gridTemplateColumns: `repeat(${compareList.length}, 1fr)` }}
        >
          {compareList.map((property) => (
            <Link key={property.id} to={`/property/${property.id}`}>
              <Button variant="hero" className="w-full">
                View Details
              </Button>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Compare;
