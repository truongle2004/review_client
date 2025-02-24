// components/RatingDisplay.tsx
interface RatingDisplayProps {
  rating: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating }) => {
  // Clamp rating between 1 and 100
  const clampedRating = Math.min(Math.max(rating, 1), 100);

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">Rating:</span>
      <div className="badge badge-lg badge-primary">{clampedRating}</div>
      <progress className="progress progress-success w-56" value={clampedRating} max="100" />
    </div>
  );
};

export default RatingDisplay;
