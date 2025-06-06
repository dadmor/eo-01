import React from "react";
import { createRoot } from "react-dom/client";
//import "antd/dist/antd.css";
import './index.css' // <-- Upewnij się, że ten import istnieje
import reportWebVitals from "./reportWebVitals";
import App from "./App";


const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
