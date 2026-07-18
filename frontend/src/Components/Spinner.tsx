import type { FC } from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-16 w-16",
};

const borderWidths = {
  sm: "border-2",
  md: "border-4",
  lg: "border-4",
};

const Spinner: FC<SpinnerProps> = ({ size = "md", className = "", label = "Loading" }) => (
  <span role="status" aria-label={label} className={`relative inline-block shrink-0 text-brand ${sizes[size]} ${className}`}>
    <span className={`absolute inset-0 rounded-full ${borderWidths[size]} border-current/25`} />
    <span className={`absolute inset-0 animate-spin rounded-full ${borderWidths[size]} border-transparent border-t-current`} />
  </span>
);

export default Spinner;
