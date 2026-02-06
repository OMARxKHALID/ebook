import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentOrders({ orders }) {
  const getStatusBadge = (status) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="grid gap-3 sm:hidden">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id || order.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm">
                    #{(order._id || order.id)?.slice(-6)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    ${order.totalAmount?.toFixed(2)}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No orders yet
            </p>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id || order.id}>
                    <TableCell className="font-medium">
                      #{(order._id || order.id)?.slice(-6)}
                    </TableCell>
                    <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No orders yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
