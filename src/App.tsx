// src/App.tsx

import { Refine } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import { dataProvider } from "@pankod/refine-supabase";
import authProvider from "./authProvider";
import { supabase } from "./utility";
import Router from "./components/Router";
import { lazy } from "react";

function App() {
  const Dashboard = lazy(() => import("./pages/Dashboard"));
  return (
    <Refine
      LoginPage={() => null}
      dataProvider={dataProvider(supabase)}
      authProvider={authProvider}
      routerProvider={routerProvider}
      resources={[
        {
          name: "dashboard",
          list: Dashboard,
        },
      ]}
      
      options={{
        syncWithLocation: false,
        warnWhenUnsavedChanges: true,
        disableTelemetry: true,
        
      }}
      catchAll={<div className="absolute">?</div>}
    >
      <Router />
    </Refine>
  );
}

export default App;
