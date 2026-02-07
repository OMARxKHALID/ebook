import { useState, useEffect } from "react";
import { Search, Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

import { OrderStatusCards } from "./orders/OrderStatusCards";
import { OrdersTable } from "./orders/OrdersTable";

import { ORDER_STATUSES } from "@/lib/orderUtils";
import { formatOrderDate } from "@/lib/dateUtils";
import { handleApiError } from "@/lib/errorHandler";
import { usePagination } from "@/hooks/usePagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminPageHeader } from "./shared/AdminPageHeader";
import { AdminPagination } from "./shared/AdminPagination";
import { SEO } from "../SEO";

export function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedOrders,
    setCurrentPage,
  } = usePagination(
    orders.filter((order) => {
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    }),
    10,
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      handleApiError(error, "Loading Orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, setCurrentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          (order._id || order.id) === orderId
            ? { ...order, status: newStatus }
            : order,
        ),
      );
      toast.success("Order status updated");
    } catch (error) {
      handleApiError(error, "Update Order Status");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <SEO
        title="Manage Orders"
        description="Review customer orders and update shipping status."
        noindex={true}
      />
      <AdminPageHeader
        title="Orders"
        description={`Manage customer orders. ${orders.length} total orders.`}
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </AdminPageHeader>

      <OrderStatusCards
        orders={orders}
        orderStatuses={ORDER_STATUSES}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and manage all customer orders (Page {currentPage} of{" "}
                {totalPages || 1})
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={paginatedOrders}
            orderStatuses={ORDER_STATUSES}
            onStatusChange={handleStatusChange}
            formatDate={formatOrderDate}
          />

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default OrdersManagement;
