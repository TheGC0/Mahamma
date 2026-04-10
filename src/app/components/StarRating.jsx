import { Star } from "lucide-react";

export function StarRating({ rating, showNumber = true, size = "sm" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-[#F7931E] text-[#F7931E]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
