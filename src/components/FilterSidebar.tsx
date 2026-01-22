import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  Star,
  DollarSign,
  UtensilsCrossed,
  Home,
  Users,
  Building2,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface FilterState {
  priceRange: [number, number];
  rating: number;
  roomTypes: string[];
  hasMess: boolean | null;
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const roomTypeOptions = [
  { value: "single", label: "Single Room", icon: Home },
  { value: "shared", label: "Shared Room", icon: Users },
  { value: "studio", label: "Studio", icon: Building2 },
];

// Helper Component for Sections
const Section = ({
  id,
  title,
  icon: Icon,
  children,
  expandedSections,
  toggleSection
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  expandedSections: string[];
  toggleSection: (id: string) => void;
}) => {
  const isExpanded = expandedSections.includes(id);
  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <div className="flex items-center gap-2 font-medium">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""
            }`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSections, setExpandedSections] = useState<string[]>(["price", "rating", "room", "amenities"]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      priceRange: [500, 3000],
      rating: 0,
      roomTypes: [],
      hasMess: null,
      verifiedOnly: false,
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Section definition moved outside

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-16 bottom-0 w-80 bg-card border-r border-border z-50 overflow-y-auto scrollbar-thin lg:relative lg:top-0 lg:translate-x-0 lg:z-auto"
        style={{ transform: `translateX(${isOpen ? 0 : -320}px)` }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Filters</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Price Range */}
            <Section
              id="price"
              title="Price Range"
              icon={DollarSign}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="px-1">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">
                    ${localFilters.priceRange[0]}
                  </span>
                  <span className="text-muted-foreground">
                    ${localFilters.priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={localFilters.priceRange}
                  onValueChange={(value) =>
                    setLocalFilters({ ...localFilters, priceRange: value as [number, number] })
                  }
                  min={500}
                  max={3000}
                  step={50}
                  className="mb-2"
                />
              </div>
            </Section>

            {/* Rating */}
            <Section
              id="rating"
              title="Minimum Rating"
              icon={Star}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="flex gap-2">
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setLocalFilters({ ...localFilters, rating })}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${localFilters.rating === rating
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                      }`}
                  >
                    {rating === 0 ? (
                      "Any"
                    ) : (
                      <>
                        {rating}
                        <Star className="w-3 h-3 fill-current" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </Section>

            {/* Room Type */}
            <Section
              id="room"
              title="Room Type"
              icon={Home}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="space-y-3">
                {roomTypeOptions.map(({ value, label, icon: Icon }) => (
                  <div key={value} className="flex items-center space-x-3">
                    <Checkbox
                      id={value}
                      checked={localFilters.roomTypes.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setLocalFilters({
                            ...localFilters,
                            roomTypes: [...localFilters.roomTypes, value],
                          });
                        } else {
                          setLocalFilters({
                            ...localFilters,
                            roomTypes: localFilters.roomTypes.filter((t) => t !== value),
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </Section>

            {/* Amenities */}
            <Section
              id="amenities"
              title="Amenities"
              icon={UtensilsCrossed}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="mess"
                    checked={localFilters.hasMess === true}
                    onCheckedChange={(checked) => {
                      setLocalFilters({
                        ...localFilters,
                        hasMess: checked ? true : null,
                      });
                    }}
                  />
                  <Label htmlFor="mess" className="flex items-center gap-2 cursor-pointer">
                    <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                    Mess Available
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="verified"
                    checked={localFilters.verifiedOnly}
                    onCheckedChange={(checked) => {
                      setLocalFilters({
                        ...localFilters,
                        verifiedOnly: checked as boolean,
                      });
                    }}
                  />
                  <Label htmlFor="verified" className="flex items-center gap-2 cursor-pointer">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Verified Only
                  </Label>
                </div>
              </div>
            </Section>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Filter Button for triggering sidebar
export const FilterButton = ({ onClick, activeCount }: { onClick: () => void; activeCount: number }) => {
  return (
    <Button variant="outline" onClick={onClick} className="gap-2">
      <SlidersHorizontal className="w-4 h-4" />
      Filters
      {activeCount > 0 && (
        <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </Button>
  );
};
