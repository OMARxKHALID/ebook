import {
  TrendingUp,
  TrendingDown,
  Book,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}) {
  const isPositive = changeType === "positive";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {change && (
            <Badge
              variant="outline"
              className={isPositive ? "text-green-600" : "text-red-600"}
            >
              {isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {change}
            </Badge>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
