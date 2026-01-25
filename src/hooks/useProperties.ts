import { useQuery } from "@tanstack/react-query";
import { Property } from "@/lib/data";
import { API_URL } from "@/lib/config";




export const useProperties = () => {
    return useQuery({
        queryKey: ["properties"],
        queryFn: async () => {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch properties");
            return response.json() as Promise<Property[]>;
        },
    });
};

export const useProperty = (id: string | undefined) => {
    return useQuery({
        queryKey: ["property", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error("Failed to fetch property");
            return response.json() as Promise<Property>;
        },
        enabled: !!id,
    });
};

export interface Review {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
    isVerified: boolean;
    helpful: number;
}

export const useReviews = (propertyId: string | undefined) => {
    return useQuery({
        queryKey: ["reviews", propertyId],
        queryFn: async () => {
            if (!propertyId) return [];
            const response = await fetch(`${API_URL}/${propertyId}/reviews`);
            if (!response.ok) throw new Error("Failed to fetch reviews");
            return response.json() as Promise<Review[]>;
        },
        enabled: !!propertyId,
    });
};
