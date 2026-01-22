import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, GraduationCap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PublicProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchPublicProfile(id);
        }
    }, [id]);

    const fetchPublicProfile = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:5001/api/user/${userId}`);

            if (!response.ok) {
                if (response.status === 404) throw new Error("User not found");
                throw new Error("Failed to load profile");
            }

            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.error(error);
            toast.error("Could not load user profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
                <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-hero">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                        {/* Header / Cover Area */}
                        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative" />

                        <div className="px-8 pb-8">
                            <div className="relative flex justify-between items-end -mt-16 mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden">
                                        {profile.photoURL ? (
                                            <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* View Mode */}
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{profile.displayName || "Anonymous User"}</h1>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        {profile.college && <><MapPin className="w-4 h-4" /> {profile.college}</>}
                                        {profile.college && profile.major && <span>•</span>}
                                        {profile.major && <>{profile.major}</>}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">About Me</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {profile.bio || "No bio available."}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Interests</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.interests && profile.interests.length > 0 ? (
                                                    profile.interests.map((interest: string, i: number) => (
                                                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                                                            {interest}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">No interests listed.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                                            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Details</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {profile.year && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <GraduationCap className="w-4 h-4 text-primary" />
                                                        <span>{profile.year}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 text-sm">
                                                    <User className="w-4 h-4 text-primary" />
                                                    <span>Student</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PublicProfile;
