import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthRoutes } from "@/pages/auth";
import { AdminRoutes } from "@/pages/admin";
import { SharedRoutes } from "@/pages/shared";
import { AuthProvider } from "@/hooks/useAuth";
import ThemeSwitcher from "./daisyModule/ThemeSwitcher";
import { ContractorRoutes } from "./pages/contractor/__ContractorRoutes";
import { OperatorRoutes } from "./pages/operator";
import { AuditorRoutes } from "./pages/auditor";
import { BeneficiaryRoutes } from "./pages/beneficiary";
const queryClient = new QueryClient({});
function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs("main", { className: " min-h-screen", children: [_jsxs(Routes, { children: [AuthRoutes(), AdminRoutes(), SharedRoutes(), BeneficiaryRoutes(), OperatorRoutes(), ContractorRoutes(), AuditorRoutes()] }), _jsx("div", { className: "fixed bottom-4 right-4 z-40", children: _jsx(ThemeSwitcher, {}) })] }) }) }), _jsx(ReactQueryDevtools, {})] }));
}
export default App;
