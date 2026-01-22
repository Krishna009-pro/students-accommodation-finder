import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, GraduationCap, FileText, Save, Loader2, Edit2, MapPin, BookOpen, Camera, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        college: "",
        bio: "",
        email: "",
        photoURL: "",
        major: "",
        year: "",
        interests: "", // Store as string for editing, split for display
        uid: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5001/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch profile');

            const data = await response.json();

            // Handle interests array <-> string conversion
            let interestsStr = "";
            if (Array.isArray(data.interests)) {
                interestsStr = data.interests.join(", ");
            } else if (typeof data.interests === 'string') {
                interestsStr = data.interests;
            }

            setFormData({
                displayName: data.displayName || "",
                college: data.college || "",
                bio: data.bio || "",
                email: data.email || "",
                photoURL: data.photoURL || "",
                major: data.major || "",
                year: data.year || "",
                interests: interestsStr,
                uid: data.uid || ""
            });
        } catch (error) {
            console.error(error);
            toast.error("Could not load profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i);

            const response = await fetch('http://localhost:5001/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    displayName: formData.displayName,
                    college: formData.college,
                    bio: formData.bio,
                    photoURL: formData.photoURL,
                    major: formData.major,
                    year: formData.year,
                    interests: interestsArray
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const copyProfileLink = () => {
        const link = `${window.location.origin}/u/${formData.uid}`;
        navigator.clipboard.writeText(link);
        toast.success("Profile link copied to clipboard!");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                {!isEditing && (
                                    <Button variant="secondary" size="sm" onClick={copyProfileLink}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="px-8 pb-8">
                            <div className="relative flex justify-between items-end -mt-16 mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden">
                                        {formData.photoURL ? (
                                            <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} variant="outline">
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <Button onClick={() => setIsEditing(false)} variant="ghost">
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Full Name</Label>
                                            <Input
                                                id="displayName"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="photoURL">Profile Photo URL</Label>
                                            <div className="relative">
                                                <Camera className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="photoURL"
                                                    value={formData.photoURL}
                                                    onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                                                    className="pl-10"
                                                    placeholder="https://example.com/photo.jpg"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="college">College / University</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="college"
                                                    value={formData.college}
                                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                                    className="pl-10"
                                                    placeholder="Your College"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="major">Major / Field of Study</Label>
                                            <div className="relative">
                                                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="major"
                                                    value={formData.major}
                                                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                                    className="pl-10"
                                                    placeholder="Major (e.g. Computer Science)"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year of Study</Label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="year"
                                                    value={formData.year}
                                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                    className="pl-10"
                                                    placeholder="1st Year, Senior, etc."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="interests">Interests (comma separated)</Label>
                                            <Input
                                                id="interests"
                                                value={formData.interests}
                                                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                                placeholder="Cycling, Coding, Music..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="min-h-[100px]"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" variant="hero" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    {/* View Mode */}
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1">{formData.displayName || "Anonymous User"}</h1>
                                        <p className="text-muted-foreground flex items-center gap-2">
                                            {formData.college && <><MapPin className="w-4 h-4" /> {formData.college}</>}
                                            {formData.college && formData.major && <span>•</span>}
                                            {formData.major && <>{formData.major}</>}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2 space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">About Me</h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {formData.bio || "No bio added yet."}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Interests</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.interests ? (
                                                        formData.interests.split(',').map((interest, i) => (
                                                            <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                                                                {interest.trim()}
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
                                                    {formData.year && (
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <GraduationCap className="w-4 h-4 text-primary" />
                                                            <span>{formData.year}</span>
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
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
