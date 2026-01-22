import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Grid, List, MapPin, SlidersHorizontal, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollegeSearch } from "@/components/CollegeSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/Skeleton";
import { FilterSidebar, FilterButton, FilterState } from "@/components/FilterSidebar";
import { useProperties } from "@/hooks/useProperties";
import { PropertyMap } from "@/components/PropertyMap";

const Search = () => {
  const [searchParams] = useSearchParams();
  const collegeParam = searchParams.get("college");

  const { data: properties = [], isLoading } = useProperties();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 3000],
    rating: 0,
    roomTypes: [],
    hasMess: null,
    verifiedOnly: false,
  });

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Price filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && property.rating < filters.rating) {
        return false;
      }

      // Room type filter
      if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(property.roomType)) {
        return false;
      }

      // Mess filter
      if (filters.hasMess !== null && property.hasMess !== filters.hasMess) {
        return false;
      }

      // Verified filter
      if (filters.verifiedOnly && !property.isVerified) {
        return false;
      }

      // College filter (from URL)
      if (collegeParam) {
        const searchLower = collegeParam.toLowerCase();
        if (!property.college.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [filters, collegeParam, properties]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] !== 500 || filters.priceRange[1] !== 3000) count++;
    if (filters.rating > 0) count++;
    if (filters.roomTypes.length > 0) count++;
    if (filters.hasMess !== null) count++;
    if (filters.verifiedOnly) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-hero">
      {/* Search Header */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 max-w-xl">
              <CollegeSearch variant="compact" />
            </div>

            <div className="flex items-center gap-2">
              <FilterButton onClick={() => setIsFilterOpen(true)} activeCount={activeFilterCount} />

              <div className="flex items-center border border-border rounded-lg p-1 bg-muted/50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {collegeParam && (
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Showing results near <strong className="text-foreground">{collegeParam}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-36">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                isOpen={true}
                onClose={() => { }}
              />
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <strong className="text-foreground">{filteredProperties.length}</strong> properties found
                  </>
                )}
              </p>

              <select className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Distance: Nearest</option>
              </select>
            </div>

            {/* Property Grid/List */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              viewMode === "map" ? (
                <PropertyMap properties={filteredProperties} />
              ) : (
                <motion.div
                  layout
                  className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                >
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant={viewMode === "list" ? "list" : "grid"}
                    />
                  ))}
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      priceRange: [500, 3000],
                      rating: 0,
                      roomTypes: [],
                      hasMess: null,
                      verifiedOnly: false,
                    })
                  }
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
