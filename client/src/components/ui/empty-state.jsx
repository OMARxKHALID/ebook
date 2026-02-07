import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
          <Icon size={24} className="text-primary opacity-30" />
        </div>
      )}

      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}
