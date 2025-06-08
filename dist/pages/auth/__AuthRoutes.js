import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/routes/AuthRoutes.tsx
import { Route } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
export const AuthRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/", element: _jsx(Login, {}) })] }));
