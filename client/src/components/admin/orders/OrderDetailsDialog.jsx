import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function OrderDetailsDialog({
  isOpen,
  onOpenChange,
  order,
  orderStatuses,
  onStatusChange,
}) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full sm:w-[95vw] max-h-dvh sm:max-h-[85vh] overflow-y-auto rounded-none sm:rounded-2xl p-0 border-none shadow-2xl bg-background">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b sticky top-0 z-20 backdrop-blur-lg bg-background/90">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-3">
              Order Detail
              <span className="text-muted-foreground font-semibold text-sm sm:text-base opacity-60">
                {order.orderNumber || `#${(order._id || order.id).slice(-6)}`}
              </span>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/50">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">
                Customer
              </h4>
              <div className="space-y-1">
                <p className="font-bold text-sm sm:text-base truncate text-foreground">
                  {order.user?.name}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate opacity-80">
                  {order.user?.email}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2 sm:mb-3">
                Status
              </h4>
              <Select
                value={order.status}
                onValueChange={(value) =>
                  onStatusChange(order._id || order.id, value)
                }
              >
                <SelectTrigger className="rounded-xl h-9 sm:h-11 text-sm bg-background border-primary/20 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2.5">
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
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
              Shipping Logistics
            </h4>
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed bg-muted/5 text-sm text-muted-foreground leading-relaxed">
              {order.shippingAddress ? (
                <div className="space-y-1 font-medium">
                  <p className="text-foreground font-bold text-base">
                    {order.shippingAddress.street}
                  </p>
                  <p className="opacity-80">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </p>
                </div>
              ) : (
                <p className="italic opacity-50">
                  No delivery address provided.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Ordered Items ({order.items?.length || 0})
              </h4>
            </div>
            <div className="rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50 bg-card/10 shadow-sm">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <span className="font-bold text-sm sm:text-base line-clamp-1 text-foreground">
                      {item.book?.title || "Premium Book Edition"}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium opacity-70">
                      Quantity: {item.quantity || 1} • Unit Price: $
                      {item.price?.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-bold text-primary sm:text-lg tracking-tight">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="px-5 sm:px-6 py-4 sm:py-5 bg-primary/5 flex items-center justify-between font-black border-t-2 border-primary/20">
                <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold opacity-60">
                  Total Revenue
                </span>
                <span className="text-primary text-xl sm:text-2xl tracking-tighter shadow-primary/10 transition-transform hover:scale-105 cursor-default">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 py-5 sm:py-6 border-t sticky bottom-0 bg-background/95 backdrop-blur-lg z-20 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-11 px-10 font-bold text-xs sm:text-sm uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Close Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
