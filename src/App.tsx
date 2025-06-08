import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthRoutes } from "@/pages/auth";
import { DashboardRoutes } from "@/pages/dashboard";
import { AdminRoutes } from "@/pages/admin";
import { SharedRoutes } from "@/pages/shared";
import { AuthProvider } from "@/hooks/useAuth";
import ThemeSwitcher from "./daisyModule/ThemeSwitcher";
import { UiKitRoutes } from "./components/ui/_demo/dashboard";

const queryClient = new QueryClient({
  /* ... */
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <main className="pt-16 min-h-screen">
            <Routes>
              {AuthRoutes()}
              {DashboardRoutes()}
              {AdminRoutes()}
              {SharedRoutes()}
              {UiKitRoutes()}
            </Routes>
            <div className="fixed bottom-4 right-4 z-40">
              <ThemeSwitcher />
            </div>
          </main>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
