import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";

export function OrdersTable({
  orders,
  orderStatuses,
  onViewDetails,
  onStatusChange,
  getStatusBadge,
  formatDate,
}) {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-card rounded-xl border p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-sm">
                    {order.orderNumber ||
                      `#${(order._id || order.id).slice(-6)}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {order.items?.length || 0} item(s)
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(order)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Update Status
                    </DropdownMenuLabel>
                    {orderStatuses.map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status.value}
                        checked={order.status === status.value}
                        onCheckedChange={() =>
                          onStatusChange(order._id || order.id, status.value)
                        }
                      >
                        {status.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Total
                  </p>
                  <p className="text-sm font-bold text-primary">
                    ${order.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-dashed">
                  <span className="text-xs font-medium">Order Status</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed text-muted-foreground text-sm italic">
            No orders found.
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id || order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber ||
                      `#${(order._id || order.id).slice(-6)}`}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {order.items?.length || 0} item(s)
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${order.totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Update Status
                        </DropdownMenuLabel>
                        {orderStatuses.map((status) => (
                          <DropdownMenuCheckboxItem
                            key={status.value}
                            checked={order.status === status.value}
                            onCheckedChange={() =>
                              onStatusChange(
                                order._id || order.id,
                                status.value,
                              )
                            }
                          >
                            {status.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
