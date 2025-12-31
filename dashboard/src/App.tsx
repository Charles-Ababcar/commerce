import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/product/Products";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Shop from "./pages/shop/Shop";
import NotFound from "./pages/NotFound";
import '@mantine/core/styles.css';
import CategoryList from "./pages/categories/CategoryList";
import ListUsers from "./pages/users/Users";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/resetPassword";
import RequestAccess from "./pages/RequestAccess";
import DeliveryZones from "./pages/deliveryZone/DeliveryZones";
import AttributeManager from "./pages/product/AttributManger/AttributeManager";
const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><ListUsers /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/category" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/deliver-zones" element={<DeliveryZones />} />
            <Route path="/attributes"  element={<AttributeManager />}/>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
