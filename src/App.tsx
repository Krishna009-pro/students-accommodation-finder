import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { CompareDrawer, CompareToggle } from "@/components/CompareDrawer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import WriteReview from "./pages/WriteReview";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CompareProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<Search />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/property/:id/review" element={<WriteReview />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/u/:id" element={<PublicProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CompareDrawer />
              <CompareToggle />
            </BrowserRouter>
          </TooltipProvider>
        </CompareProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
