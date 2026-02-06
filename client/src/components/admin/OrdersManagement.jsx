import { useState, useEffect } from "react";
import { Search, Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { OrderStatusCards } from "./orders/OrderStatusCards";
import { OrdersTable } from "./orders/OrdersTable";
import { OrderDetailsDialog } from "./orders/OrderDetailsDialog";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

const orderStatuses = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-yellow-500" },
  {
    value: "processing",
    label: "Processing",
    icon: Package,
    color: "text-blue-500",
  },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-purple-500" },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
];

export function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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
      if (
        selectedOrder &&
        (selectedOrder._id || selectedOrder.id) === orderId
      ) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig =
      orderStatuses.find((s) => s.value === status) || orderStatuses[0];
    const Icon = statusConfig.icon;

    const variants = {
      pending: "secondary",
      processing: "outline",
      shipped: "outline",
      completed: "default",
      cancelled: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="gap-1">
        <Icon className={`h-3 w-3 ${statusConfig.color}`} />
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders. {orders.length} total orders.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <OrderStatusCards
        orders={orders}
        orderStatuses={orderStatuses}
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
                  {orderStatuses.map((status) => (
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
            orderStatuses={orderStatuses}
            onViewDetails={viewOrderDetails}
            onStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailsDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        order={selectedOrder}
        orderStatuses={orderStatuses}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default OrdersManagement;
