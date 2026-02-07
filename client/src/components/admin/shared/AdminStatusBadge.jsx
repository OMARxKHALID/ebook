import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AdminStatusBadge({ status, className }) {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
      case "active":
      case "in stock":
        return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50";
      case "shipped":
      case "processing":
      case "new":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200/50";
      case "pending":
      case "low stock":
        return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200/50";
      case "cancelled":
      case "out of stock":
      case "inactive":
        return "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200/50";
      default:
        return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-200/50";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize px-2.5 py-0.5 rounded-full border shadow-none transition-colors",
        getStatusStyles(status),
        className,
      )}
    >
      {status}
    </Badge>
  );
}

export default AdminStatusBadge;
