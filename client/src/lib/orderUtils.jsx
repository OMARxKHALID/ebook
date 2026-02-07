import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

export const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    variant: "secondary",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "text-blue-500",
    variant: "outline",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-500",
    variant: "outline",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    variant: "default",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    variant: "destructive",
  },
};

export const ORDER_STATUSES = Object.entries(ORDER_STATUS_CONFIG).map(
  ([value, config]) => ({
    value,
    ...config,
  }),
);

export function getOrderStatusBadge(status) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}
