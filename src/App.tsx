import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignUpComplete from "./pages/SignUpComplete";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import WhatToCompost from "./pages/WhatToCompost";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./pages/ScrollToTop";
import PickupInstructions from "@/pages/PickupInstructions";
// import AdminRoute from "@/components/AdminRoute";
// import Users from "./pages/Users";
// import MapPage from "./pages/MapPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup-complete" element={<SignUpComplete />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/what-to-compost" element={<WhatToCompost />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/pickup" element={<PickupInstructions />} />
                {/* <Route
                  path="/users"
                  element={
                    <AdminRoute>
                      <Users />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <AdminRoute>
                      <MapPage />
                    </AdminRoute>
                  }
                /> */}
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
