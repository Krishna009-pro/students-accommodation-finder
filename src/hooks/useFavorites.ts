import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Property } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";


export const useFavorites = () => {
    const token = localStorage.getItem('token');
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["favorites", currentUser?.uid],
        queryFn: async () => {
            if (!token) return [];
            const response = await fetch(`${API_URL}/favorites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch favorites");
            return response.json() as Promise<Property[]>;
        },
        enabled: !!token,
    });

    const addFavoriteMutation = useMutation({
        mutationFn: async (property: Property) => {
            if (!token) throw new Error("Please sign in to add favorites");
            const response = await fetch(`${API_URL}/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ property }),
            });
            if (!response.ok) throw new Error("Failed to add favorite");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
            toast.success("Added to favorites");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add favorite");
        }
    });

    const removeFavoriteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!token) throw new Error("Please sign in to remove favorites");
            const response = await fetch(`${API_URL}/favorites/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to remove favorite");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
            toast.success("Removed from favorites");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to remove favorite");
        }
    });

    const isFavorite = (id: string) => {
        return query.data?.some(p => p.id === id) || false;
    };

    return {
        favorites: query.data || [],
        isLoading: query.isLoading,
        addFavorite: addFavoriteMutation.mutate,
        removeFavorite: removeFavoriteMutation.mutate,
        isFavorite,
        isAdding: addFavoriteMutation.isPending,
        isRemoving: removeFavoriteMutation.isPending
    };
};
