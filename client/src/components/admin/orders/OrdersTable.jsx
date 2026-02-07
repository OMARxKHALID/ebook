import { useNavigate } from "react-router-dom";
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
import { MoreHorizontal, Eye, Package } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminStatusBadge } from "../shared/AdminStatusBadge";

export function OrdersTable({
  orders,
  orderStatuses,
  onStatusChange,
  formatDate,
}) {
  const navigate = useNavigate();

  return (
    <>
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
                      {order.books?.length || 0} item(s)
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
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/admin/orders/${order._id || order.id}`)
                      }
                    >
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
                  <AdminStatusBadge status={order.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={Package}
            title="No orders found"
            description="You don't have any orders yet."
          />
        )}
      </div>

      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id || order.id} className="group">
                  <TableCell className="font-medium pl-4">
                    {order.orderNumber ||
                      `#${(order._id || order.id).slice(-6)}`}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">
                        {order.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {order.books?.length || 0} item(s)
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm">
                    ${order.totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge
                      status={order.status}
                      className="text-[10px] h-5"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/admin/orders/${order._id || order.id}`)
                          }
                        >
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
                <TableCell colSpan={7} className="h-64">
                  <EmptyState
                    icon={Package}
                    title="No orders found"
                    description="You don't have any orders yet."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
