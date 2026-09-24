import { useState } from "react";
import { Star } from "lucide-react";
import { useSubmitRating } from "@/api/mutations";
import { queryClient } from "@/lib/queryClient";

interface StarRatingProps {
  toolId: string;
  currentRating: number;
  reviewCount: number;
  onRatingSubmitted?: () => void;
}

export function StarRating({ toolId, currentRating, reviewCount, onRatingSubmitted }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [displayRating, setDisplayRating] = useState(currentRating);
  const [displayCount, setDisplayCount] = useState(reviewCount);
  const submitRatingMutation = useSubmitRating();

  const handleRating = async (rating: number) => {
    try {
      await submitRatingMutation.mutateAsync({ toolId, rating });
      
      // Wait a moment for trigger to execute, then refetch
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['tool', toolId] });
        queryClient.refetchQueries({ queryKey: ['tools'] });
      }, 300);
      
      setHasRated(true);
      setTimeout(() => setHasRated(false), 2000);
      onRatingSubmitted?.();
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  // Update display when props change
  if (currentRating !== displayRating || reviewCount !== displayCount) {
    setDisplayRating(currentRating);
    setDisplayCount(reviewCount);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110 cursor-pointer"
            disabled={submitRatingMutation.isPending}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (hoverRating || currentRating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{displayRating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({displayCount} {displayCount === 1 ? "review" : "reviews"})</span>
        {hasRated && <span className="text-xs text-emerald-600 font-medium">✓ Thanks for rating!</span>}
      </div>
    </div>
  );
}
