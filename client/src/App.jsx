import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, clearAuth, fetchProfile } from "./store/slices/authSlice";
import { syncCart } from "./store/slices/cartSlice";
import "remixicon/fonts/remixicon.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SidebarProvider } from "./components/ui/sidebar";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollUp from "./components/ScrollUp";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllBooksPage from "./pages/AllBooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";

import AdminSidebar from "./components/admin/AdminSidebar";
import AdminDashboard from "./components/admin/AdminDashboard";
import BooksManagement from "./components/admin/BooksManagement";
import OrdersManagement from "./components/admin/OrdersManagement";
import { SettingsPage } from "./components/admin/SettingsPage";
import { BookFormPage } from "./components/admin/books/BookFormPage";
import { OrderDetailPage } from "./components/admin/orders/OrderDetailPage";

import { Cart } from "./components/Cart";

import { useRouteTheme } from "./hooks/useRouteTheme";

function AppLayout({ children }) {
  const { isSystemRoute } = useRouteTheme();

  if (isSystemRoute) {
    return children;
  }

  return (
    <div className="bg-landing-body text-landing-text font-montserrat min-h-screen transition-colors duration-400">
      <Navbar />
      {children}
      <Footer />
      <ScrollUp />
      <Cart />
    </div>
  );
}

// Admin Layout
function AdminLayout({ children }) {
  return (
    <ProtectedRoute requireAdmin>
      <SidebarProvider>
        <AdminSidebar>{children}</AdminSidebar>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: cartItems, isInitialized } = useSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    const initAuth = async () => {
      const result = await dispatch(checkAuth());
      if (checkAuth.fulfilled.match(result)) {
        dispatch(fetchProfile());
      }
    };

    initAuth();

    const handleUnauthorized = () => {
      dispatch(clearAuth());
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [dispatch]);

  // Sync cart with server whenever it changes, but only after initialization
  useEffect(() => {
    if (token && isInitialized) {
      const timer = setTimeout(() => {
        dispatch(syncCart(cartItems));
      }, 1000); // Debounce sync
      return () => clearTimeout(timer);
    }
  }, [cartItems, token, dispatch, isInitialized]);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books" element={<AllBooksPage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminLayout>
                <BooksManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/books/new"
            element={
              <AdminLayout>
                <BookFormPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/books/edit/:id"
            element={
              <AdminLayout>
                <BookFormPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <OrdersManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <AdminLayout>
                <OrderDetailPage />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <SettingsPage />
              </AdminLayout>
            }
          />
        </Routes>
      </AppLayout>
      <Toaster position="top-right" richColors duration={2000} />
    </BrowserRouter>
  );
}

export default App;
