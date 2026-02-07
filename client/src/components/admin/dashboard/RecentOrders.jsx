import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Eye } from "lucide-react";
import { AdminStatusBadge } from "../shared/AdminStatusBadge";

export function RecentOrders({ orders }) {
  const navigate = useNavigate();

  return (
    <Card className="col-span-1 border shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest customer transactions
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 pr-2">
          <Link to="/admin/orders">
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {/* Mobile View */}
        <div className="grid gap-3 p-4 md:hidden">
          {orders.map((order) => (
            <div
              key={order._id || order.id}
              onClick={() => navigate(`/admin/orders/${order._id || order.id}`)}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 active:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  #{(order._id || order.id).slice(-6)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
              <AdminStatusBadge status={order.status} />
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-xs text-center text-muted-foreground py-4">
              No recent orders
            </p>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-2 text-[11px] font-bold uppercase tracking-wider pl-4">
                  ID
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold uppercase tracking-wider">
                  Amount
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold uppercase tracking-wider text-right pr-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id || order.id}
                  className="group cursor-pointer hover:bg-muted/30"
                  onClick={() =>
                    navigate(`/admin/orders/${order._id || order.id}`)
                  }
                >
                  <TableCell className="py-3 font-medium text-xs pl-4">
                    #{(order._id || order.id).slice(-6)}
                  </TableCell>
                  <TableCell className="py-3 text-xs font-bold">
                    ${order.totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3 text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <AdminStatusBadge
                        status={order.status}
                        className="text-[10px] h-5 px-1.5"
                      />
                      <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-xs text-muted-foreground"
                  >
                    No recent orders
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
