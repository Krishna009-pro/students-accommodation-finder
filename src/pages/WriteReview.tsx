import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useProperty } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";
// import { db } from "@/lib/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

const WriteReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading } = useProperty(id);
  const { currentUser } = useAuth();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [categories, setCategories] = useState({
    location: 0,
    cleanliness: 0,
    amenities: 0,
    value: 0,
    landlord: 0,
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || rating === 0 || review.length < 50) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        author: isAnonymous ? "Anonymous Student" : (currentUser?.displayName || "Student"),
        avatar: isAnonymous ? "" : (currentUser?.photoURL || ""),
        rating,
        content: review,
        date: new Date().toLocaleDateString(),
        isVerified,
        helpful: 0,
        categories,
        userId: currentUser?.uid || "anonymous",
        // createdAt handled by backend
      };

      const response = await fetch(`http://localhost:5001/api/properties/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) throw new Error("Failed to submit review");

      toast.success("Review submitted successfully!");
      navigate(`/property/${id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gradient-hero">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Back Button */}
        <Link
          to={`/property/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Property
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card"
        >
          {/* Property Info */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div>
              <h2 className="font-semibold text-lg">{property.title}</h2>
              <p className="text-muted-foreground text-sm">{property.location}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Overall Rating */}
            <div>
              <Label className="text-lg font-semibold block mb-4">Overall Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${star <= (hoverRating || rating)
                        ? "fill-warning text-warning"
                        : "text-muted"
                        }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-4 text-lg font-medium">
                    {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                  </span>
                )}
              </div>
            </div>

            {/* Category Ratings */}
            <div>
              <Label className="text-lg font-semibold block mb-4">Rate by Category</Label>
              <div className="grid gap-4">
                {Object.entries(categories).map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{category}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setCategories({ ...categories, [category]: star })
                          }
                          className="p-0.5"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= value
                              ? "fill-warning text-warning"
                              : "text-muted"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="review" className="text-lg font-semibold block mb-4">
                Your Review
              </Label>
              <Textarea
                id="review"
                placeholder="Share your experience living here. What did you like? What could be improved?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Minimum 50 characters. Be honest and helpful to other students.
              </p>
            </div>

            {/* Verification */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Verify Your Stay</h4>
                  <p className="text-sm text-muted-foreground">
                    Verified reviews are marked with a badge and help other students trust your feedback.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="verified"
                  checked={isVerified}
                  onCheckedChange={(checked) => setIsVerified(checked as boolean)}
                />
                <Label htmlFor="verified" className="cursor-pointer">
                  I confirm I lived at this property
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Post anonymously
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Link to={`/property/${id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                variant="hero"
                type="submit"
                className="flex-1"
                disabled={rating === 0 || review.length < 50 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default WriteReview;
