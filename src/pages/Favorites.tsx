import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";

const Favorites = () => {
    const { favorites, isLoading } = useFavorites();
    const { currentUser } = useAuth();

    if (!currentUser) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
                <Heart className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
                <h1 className="text-2xl font-bold mb-2">Sign in to view favorites</h1>
                <p className="text-muted-foreground mb-6">Save properties you love to your account.</p>
                <Link to="/login">
                    <Button size="lg">Sign In</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Your Favorites</h1>
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : favorites.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PropertyCard property={property} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-6">
                        Start exploring and save properties you like!
                    </p>
                    <Link to="/search">
                        <Button>Explore Properties</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;
