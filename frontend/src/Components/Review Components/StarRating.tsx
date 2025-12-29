interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          className={`text-lg ${
            star <= value ? "text-rose-500" : "text-gray-300"
          } ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition`}
        >
          ★
        </button>
      ))}
    </div>
  );
};
