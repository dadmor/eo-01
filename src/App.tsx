  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { BrowserRouter, Routes } from "react-router-dom";

  import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  import { AuthRoutes } from "@/pages/auth";
  import { DashboardRoutes } from "@/pages/dashboard";
  import { AdminRoutes } from "@/pages/admin";
  import { SharedRoutes } from "@/pages/shared";
  import { AuthProvider } from "@/hooks/useAuth";
  import ThemeSwitcher from "./daisyModule/ThemeSwitcher";
  import { ContractorRoutes } from "./pages/contractor/__ContractorRoutes";

  import { OperatorRoutes } from "./pages/operator";
  import { AuditorRoutes } from "./pages/auditor";
  import { BeneficiaryRoutes } from "./pages/beneficiary";

  const queryClient = new QueryClient({
    /* ... */
  });

  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <main className=" min-h-screen">
              <Routes>
                {AuthRoutes()}
                {DashboardRoutes()}
                {AdminRoutes()}
                {SharedRoutes()}
                {BeneficiaryRoutes()}
                {OperatorRoutes()}
                {ContractorRoutes()}
                {AuditorRoutes()}
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
