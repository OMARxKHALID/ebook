import { Card, CardContent } from "@/components/ui/card";

export function OrderStatusCards({
  orders,
  orderStatuses,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {orderStatuses.map((status) => {
        const count = orders.filter((o) => o.status === status.value).length;
        const Icon = status.icon;
        return (
          <Card
            key={status.value}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              statusFilter === status.value ? "border-primary" : ""
            }`}
            onClick={() =>
              onStatusFilterChange(
                statusFilter === status.value ? "all" : status.value,
              )
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {status.label}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Icon className={`h-8 w-8 ${status.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
