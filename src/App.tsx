import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useMaintenance } from "@/hooks/useQueries";
import { Maintenance } from "@/pages/Maintenance";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Compare from "./pages/Compare";
import Assistant from "./pages/Assistant";
import Admin from "./pages/Admin";
import Prompts from "./pages/Prompts";
import Profile from "./pages/Profile";
import SubmitTool from "./pages/SubmitTool";
import Contact from "./pages/Contact";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main content wrapper that checks maintenance mode
const AppContent = () => {
  const { data: isMaintenanceMode = false } = useMaintenance();

  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:id" element={<ToolDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/submit-tool" element={<SubmitTool />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/prompts/:id" element={<Prompts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:section" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
