import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";

export const CompareDrawer = () => {
  const { compareList, removeFromCompare, clearCompare, isDrawerOpen, setDrawerOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border shadow-xl"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Compare</h3>
                  <p className="text-sm text-muted-foreground">
                    {compareList.length}/3 properties selected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearCompare}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {compareList.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border min-w-[280px] shrink-0"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">${property.price}/mo</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <span>⭐ {property.rating}</span>
                      <span>•</span>
                      <span>{property.walkTime} min</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeFromCompare(property.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center justify-center bg-muted/50 rounded-xl border-2 border-dashed border-border min-w-[280px] h-24 shrink-0"
                >
                  <p className="text-sm text-muted-foreground">Add property to compare</p>
                </div>
              ))}
            </div>

            {compareList.length >= 2 && (
              <div className="mt-4 flex justify-end">
                <Link to="/compare">
                  <Button variant="hero" className="gap-2">
                    Compare Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toggle button that shows when drawer is closed
export const CompareToggle = () => {
  const { compareList, setDrawerOpen, isDrawerOpen } = useCompare();

  if (compareList.length === 0 || isDrawerOpen) return null;

  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={() => setDrawerOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-glow transition-shadow"
    >
      <BarChart3 className="w-5 h-5" />
      <span className="font-medium">Compare ({compareList.length})</span>
    </motion.button>
  );
};
