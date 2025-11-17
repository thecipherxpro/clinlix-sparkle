import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import SplashScreen from "./components/SplashScreen";
import InstallPromptCard from "./components/InstallPromptCard";
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
import FindProviders from "./pages/customer/FindProviders";
import Providers from "./pages/customer/Providers";
import ProviderProfile from "./pages/ProviderProfile";
import HowItWorks from "./pages/customer/HowItWorks";
import Pricing from "./pages/customer/Pricing";
import MyAddresses from "./pages/customer/MyAddresses";
import Booking from "./pages/customer/Booking";
import MyBookings from "./pages/customer/MyBookings";
import BookingDetails from "./pages/customer/BookingDetails";
import ReviewBooking from "./pages/customer/ReviewBooking";
import Profile from "./pages/customer/Profile";
import PaymentMethods from "./pages/customer/PaymentMethods";
import CustomerSettings from "./pages/customer/CustomerSettings";
import ProviderSettings from "./pages/provider/ProviderSettings";
import CustomerAccount from "./pages/customer/CustomerAccount";
import ProviderAccount from "./pages/provider/ProviderAccount";
import JobDetail from "./pages/provider/JobDetail";

import NotFound from "./pages/NotFound";
import CustomerLayout from "./components/layouts/CustomerLayout";
import ProviderLayout from "./components/layouts/ProviderLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <BrowserRouter>
        <TooltipProvider>
          <SplashScreen />
          <InstallPromptCard />
          <Toaster />
          <Sonner />
          <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          
          {/* Customer routes with persistent navigation */}
          <Route element={<CustomerLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/providers" element={<Providers />} />
            <Route path="/customer/find-providers" element={<FindProviders />} />
            <Route path="/customer/my-addresses" element={<MyAddresses />} />
            <Route path="/customer/booking" element={<Booking />} />
            <Route path="/customer/bookings" element={<MyBookings />} />
            <Route path="/customer/my-bookings" element={<MyBookings />} />
            <Route path="/customer/bookings/:id" element={<BookingDetails />} />
            <Route path="/customer/my-bookings/:id" element={<BookingDetails />} />
            <Route path="/customer/bookings/:id/review" element={<ReviewBooking />} />
            <Route path="/customer/account" element={<CustomerAccount />} />
            <Route path="/customer/profile" element={<Profile />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
            <Route path="/customer/payment-methods" element={<PaymentMethods />} />
            <Route path="/customer/how-it-works" element={<HowItWorks />} />
            <Route path="/customer/pricing" element={<Pricing />} />
          </Route>
          
          <Route path="/providers/profile/:providerId" element={<ProviderProfile />} />
          
          {/* Provider routes with persistent navigation */}
          <Route element={<ProviderLayout />}>
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/jobs" element={<ProviderJobs />} />
            <Route path="/provider/jobs/:id" element={<JobDetail />} />
            <Route path="/provider/jobs/:id/summary" element={<JobDetail />} />
            <Route path="/provider/schedule" element={<ProviderSchedule />} />
            <Route path="/provider/wallet" element={<ProviderWallet />} />
            <Route path="/provider/account" element={<ProviderAccount />} />
            <Route path="/provider/profile" element={<ProviderProfilePage />} />
            <Route path="/provider/settings" element={<ProviderSettings />} />
            <Route path="/provider/reviews" element={<ProviderReviews />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
