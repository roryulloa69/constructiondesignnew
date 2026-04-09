import React, { lazy, Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
console.log("Application starting...");
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary, RouteErrorElement } from "@/components/ErrorBoundary";

// Lazy load all route components for better code splitting
const Index = lazy(() => import("./pages/Index"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Design = lazy(() => import("./pages/Design"));
const DesignDetail = lazy(() => import("./pages/DesignDetail"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream/30">
    <div className="text-charcoal font-light">Loading...</div>
  </div>
);

const queryClient = new QueryClient();

const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/projects/:id",
    element: <ProjectDetail />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/design",
    element: <Design />,
  },
  {
    path: "/design/:id",
    element: <DesignDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Create router with future flag
const router = createBrowserRouter(
  routes.map(r => ({ ...r, errorElement: <RouteErrorElement /> })),
  {
    future: {
      v7_relativeSplatPath: true,
    },
  });

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <RouterProvider router={router} future={{ v7_startTransition: true }} />
              </Suspense>
            </ErrorBoundary>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
