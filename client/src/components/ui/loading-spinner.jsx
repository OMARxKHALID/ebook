import { cn } from "@/lib/utils";

export function LoadingSpinner({
  size = "default",
  className,
  fullScreen = false,
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-b-2 border-primary",
        sizeClasses[size],
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
