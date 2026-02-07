import { useState, useEffect } from "react";
import { Book, ShoppingCart, DollarSign, Users } from "lucide-react";
import { booksApi, ordersApi } from "@/lib/api";
import { StatCard } from "./dashboard/StatCard";
import { RecentOrders } from "./dashboard/RecentOrders";
import { RecentBooks } from "./dashboard/RecentBooks";
import { AdminPageHeader } from "./shared/AdminPageHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SEO } from "../SEO";

export function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, ordersData] = await Promise.all([
        booksApi.getAll(),
        ordersApi.getAll().catch(() => []), // Handle if not admin
      ]);

      setBooks(booksData.slice(0, 5));
      setOrders(ordersData.slice(0, 5));

      // Calculate stats
      const totalRevenue = ordersData.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0,
      );

      setStats({
        totalBooks: booksData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        totalCustomers: new Set(ordersData.map((o) => o.user?._id || o.user))
          .size,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SEO
        title="Admin Dashboard"
        description="Overview of your ebook store's performance."
        noindex={true}
      />
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your e-book store."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard title="Total Books" value={stats.totalBooks} icon={Book} />
        <StatCard
          title="Active Customers"
          value={stats.totalCustomers}
          icon={Users}
        />
      </div>

      {/* Recent Activity Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentOrders orders={orders} />
        <RecentBooks books={books} />
      </div>
    </div>
  );
}

export default AdminDashboard;
