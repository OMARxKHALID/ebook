import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Package,
  User,
  Mail,
  MapPin,
  ShoppingBag,
  Info,
  ChevronRight,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersApi } from "@/lib/api";
import { handleApiError } from "@/lib/errorHandler";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminPageHeader } from "../shared/AdminPageHeader";
import { AdminStatusBadge } from "../shared/AdminStatusBadge";
import { ORDER_STATUSES } from "@/lib/orderUtils";
import { formatOrderDate } from "@/lib/dateUtils";
import { toast } from "sonner";
import { SEO } from "../../SEO";

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await ordersApi.getById(id);
      setOrder(data);
    } catch (error) {
      handleApiError(error, "Loading Order");
      navigate("/admin/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await ordersApi.updateStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success("Order status updated");
    } catch (error) {
      handleApiError(error, "Updating Status");
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!order) return null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <SEO
        title={`Order Details #${(order._id || order.id).slice(-6)}`}
        description="Review customer order details."
        noindex={true}
      />
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/orders")}
          className="h-10 w-10 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <AdminPageHeader
          title={`Order #${(order._id || order.id).slice(-6)}`}
          description={`Placed on ${formatOrderDate(order.createdAt)}`}
          className="flex-1"
        >
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </AdminPageHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 font-mono">
                <ShoppingBag className="h-4 w-4" />
                Ordered Items ({order.books?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.books?.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 md:p-6 flex items-center gap-4 hover:bg-muted/5 transition-colors group"
                  >
                    <div className="h-20 w-14 shrink-0 rounded-md border bg-muted overflow-hidden shadow-sm">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Badge
                          variant="secondary"
                          className="font-mono text-[10px] h-4"
                        >
                          ${item.price?.toFixed(2)}
                        </Badge>
                        <span>×</span>
                        <span className="font-semibold">
                          {item.quantity || 1}
                        </span>
                      </div>
                    </div>
                    <div className="text-right pl-4">
                      <p className="font-bold text-sm md:text-base">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/20 p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Free Shipping
                  </span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-black uppercase tracking-tight">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-primary tracking-tighter shadow-primary/5">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Logistics
              </CardTitle>
            </CardHeader>
            <Separator className="mx-6" />
            <CardContent className="p-6">
              {order.shippingAddress ? (
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground/80 mb-1">
                    Delivery Destination
                  </div>
                  <p className="font-bold text-base leading-tight">
                    {order.shippingAddress.street}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 opacity-50">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                  <p className="text-sm italic">
                    Digital products - No shipping logistics required
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-6">
          {/* Status Sidebar Card */}
          <Card className="border shadow-sm bg-muted/10">
            <CardHeader className="pb-3 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Order Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border shadow-sm">
                <span className="text-xs font-bold">Current Phase</span>
                <AdminStatusBadge
                  status={order.status}
                  className="h-6 text-[10px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground/80 px-1">
                  Transition Status
                </label>
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-10 bg-background border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <status.icon className={`h-4 w-4 ${status.color}`} />
                          <span className="text-sm font-semibold">
                            {status.label}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-2 text-[10px] text-muted-foreground p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                <p>
                  Status changes act as triggers for automated customer
                  notification emails.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Sidebar Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Customer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-black shadow-lg shadow-primary/20">
                  {order.user?.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-sm truncate uppercase tracking-tight">
                    {order.user?.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate opacity-70">
                    <Mail className="h-3 w-3" />
                    {order.user?.email}
                  </div>
                </div>
              </div>
              <Separator />
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-between text-xs h-8 group hover:bg-muted/50"
              >
                View Purchase History
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Metadata Sidebar Card */}
          <div className="px-4 py-3 rounded-xl border-2 border-dashed border-muted flex flex-col items-center gap-1 opacity-50 text-[10px] font-mono">
            <span className="uppercase text-muted-foreground tracking-[0.2em] mb-1">
              System Internal ID
            </span>
            <span>{order._id || order.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
