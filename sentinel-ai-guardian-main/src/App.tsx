import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Admin Pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminThreats from "./pages/admin/AdminThreats";
import AdminSecurityLogs from "./pages/admin/AdminSecurityLogs";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminChatbot from "./pages/admin/AdminChatbot";

// Employee Pages
import EmployeeWorkspace from "./pages/employee/EmployeeWorkspace";
import EmployeeLogs from "./pages/employee/EmployeeLogs";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: ('admin' | 'employee')[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/employee';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Dashboard redirect based on role
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }
  return <Navigate to="/dashboard/employee" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginPage />} />

    {/* Dashboard redirect */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardRedirect />
        </ProtectedRoute>
      }
    />

    {/* Admin routes */}
    <Route
      path="/dashboard/admin"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminOverview />} />
      <Route path="threats" element={<AdminThreats />} />
      <Route path="logs" element={<AdminSecurityLogs />} />
      <Route path="chatbot" element={<AdminChatbot />} />
      <Route path="integrations" element={<AdminIntegrations />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>

    {/* Employee routes */}
    <Route
      path="/dashboard/employee"
      element={
        <ProtectedRoute allowedRoles={['employee']}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<EmployeeWorkspace />} />
      <Route path="logs" element={<EmployeeLogs />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
