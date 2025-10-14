import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderJobs from "./pages/provider/ProviderJobs";
import ProviderSchedule from "./pages/provider/ProviderSchedule";
import ProviderWallet from "./pages/provider/ProviderWallet";
import ProviderProfilePage from "./pages/provider/ProviderProfilePage";
import ProviderReviews from "./pages/provider/ProviderReviews";
import Providers from "./pages/customer/Providers";
import FindProviders from "./pages/customer/FindProviders";
import MyAddresses from "./pages/customer/MyAddresses";
import Booking from "./pages/customer/Booking";
import MyBookings from "./pages/customer/MyBookings";
import BookingDetails from "./pages/customer/BookingDetails";
import ReviewBooking from "./pages/customer/ReviewBooking";
import Profile from "./pages/customer/Profile";
import PaymentMethods from "./pages/customer/PaymentMethods";
import CustomerSettings from "./pages/customer/CustomerSettings";
import ProviderSettings from "./pages/provider/ProviderSettings";
import ProviderProfile from "./pages/ProviderProfile";
import JobDetail from "./pages/provider/JobDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/providers" element={<Providers />} />
          <Route path="/customer/find-providers" element={<FindProviders />} />
          <Route path="/customer/my-addresses" element={<MyAddresses />} />
          <Route path="/customer/booking" element={<Booking />} />
          <Route path="/customer/bookings" element={<MyBookings />} />
          <Route path="/customer/bookings/:id" element={<BookingDetails />} />
          <Route path="/customer/bookings/:id/review" element={<ReviewBooking />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/customer/settings" element={<CustomerSettings />} />
          <Route path="/customer/payment-methods" element={<PaymentMethods />} />
          <Route path="/providers/profile/:providerId" element={<ProviderProfile />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/jobs" element={<ProviderJobs />} />
          <Route path="/provider/jobs/:id" element={<JobDetail />} />
          <Route path="/provider/jobs/:id/summary" element={<JobDetail />} />
          <Route path="/provider/schedule" element={<ProviderSchedule />} />
          <Route path="/provider/wallet" element={<ProviderWallet />} />
          <Route path="/provider/profile" element={<ProviderProfilePage />} />
          <Route path="/provider/settings" element={<ProviderSettings />} />
          <Route path="/provider/reviews" element={<ProviderReviews />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
