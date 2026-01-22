import { Star, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  isVerified: boolean;
  helpful: number;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const getSentimentColor = (rating: number) => {
    if (rating >= 4) return "bg-success";
    if (rating >= 3) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium">
          {review.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{review.author}</span>
            {review.isVerified && (
              <Badge variant="verified" className="gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? "fill-warning text-warning" : "text-muted"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
        </div>
        <div
          className={`w-8 h-2 rounded-full ${getSentimentColor(review.rating)}`}
          title={`Rating: ${review.rating}/5`}
        />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {review.content}
      </p>

      <div className="flex items-center gap-4 text-sm">
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful ({review.helpful})</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


