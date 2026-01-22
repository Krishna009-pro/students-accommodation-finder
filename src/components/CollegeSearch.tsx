import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colleges } from "@/lib/data";
import { useNavigate } from "react-router-dom";

interface CollegeSearchProps {
  variant?: "hero" | "compact";
  onSearch?: (college: string) => void;
}

export const CollegeSearch = ({ variant = "hero", onSearch }: CollegeSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 0) {
      const filtered = colleges.filter((college) =>
        college.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredColleges(filtered);
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setFilteredColleges([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (college: string) => {
    setQuery(college);
    setIsOpen(false);
    if (onSearch) {
      onSearch(college);
    } else {
      navigate(`/search?college=${encodeURIComponent(college)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < filteredColleges.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredColleges[selectedIndex]) {
        handleSelect(filteredColleges[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const isHero = variant === "hero";

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center ${
          isHero
            ? "bg-card shadow-xl rounded-2xl border border-border/50 overflow-hidden"
            : "bg-card shadow-md rounded-xl border border-border"
        }`}
      >
        <div className={`flex items-center gap-3 ${isHero ? "px-6 py-5" : "px-4 py-3"} flex-1`}>
          <GraduationCap className={`${isHero ? "w-6 h-6" : "w-5 h-5"} text-primary shrink-0`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your college..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setIsOpen(true)}
            className={`flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground ${
              isHero ? "text-lg" : "text-base"
            }`}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button
          variant="hero"
          size={isHero ? "lg" : "default"}
          className={isHero ? "mr-3 rounded-xl" : "mr-2 rounded-lg"}
          onClick={() => {
            if (query) {
              handleSelect(query);
            }
          }}
        >
          <Search className="w-4 h-4" />
          {isHero && <span className="hidden sm:inline">Search</span>}
        </Button>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && filteredColleges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50"
          >
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {filteredColleges.map((college, index) => (
                <button
                  key={college}
                  onClick={() => handleSelect(college)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{college}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      <AnimatePresence>
        {isOpen && query.length > 0 && filteredColleges.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border p-4 z-50"
          >
            <p className="text-muted-foreground text-center">
              No colleges found. Try a different search.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
