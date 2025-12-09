import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import Cart from "./pages/Cart";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ShopDetailPage from "./pages/ShopDetailPage";
import ShopsPage from "./pages/Shops";
import ForgotPassword from "../../dashboard/src/pages/ForgetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/shops/:shopId" element={<ShopDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/:cartId" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId?" element={<OrderSuccessPage />} />
          <Route path="/auth" element={<Auth />} />
           <Route path="/forget-password" element={<ForgotPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
