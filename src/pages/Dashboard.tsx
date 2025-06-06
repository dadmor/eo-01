// src/pages/Dashboard.tsx
import React from "react";
import { useGetIdentity, usePermissions } from "@pankod/refine-core";

export const Dashboard: React.FC = () => {
  const { data: identity } = useGetIdentity();
  const { data: permissions } = usePermissions();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "15px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3>Witaj!</h3>
        <p><strong>Email:</strong> {identity?.name || "Ładowanie..."}</p>
        <p><strong>Rola:</strong> {permissions || "Ładowanie..."}</p>
      </div>
      
      <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        <div style={{ 
          border: "1px solid #ddd", 
          padding: "15px", 
          borderRadius: "8px",
          backgroundColor: "white"
        }}>
          <h4>Szybkie akcje</h4>
          <ul>
            <li><a href="/profile">Mój profil</a></li>
            {permissions === "beneficiary" && (
              <>
                <li><a href="/service-request">Nowe zgłoszenie</a></li>
                <li><a href="/my-requests">Moje zgłoszenia</a></li>
              </>
            )}
            {permissions === "contractor" && (
              <>
                <li><a href="/contractor-marketplace">Marketplace</a></li>
                <li><a href="/contractor-portfolio">Portfolio</a></li>
              </>
            )}
            {permissions === "auditor" && (
              <>
                <li><a href="/auditor-marketplace">Marketplace</a></li>
                <li><a href="/auditor-portfolio">Portfolio</a></li>
              </>
            )}
            {(permissions === "operator" || permissions === "admin") && (
              <>
                <li><a href="/operator/requests">Zarządzaj zgłoszeniami</a></li>
                <li><a href="/operator/moderation">Moderacja</a></li>
              </>
            )}
            {permissions === "admin" && (
              <>
                <li><a href="/admin/users">Zarządzaj użytkownikami</a></li>
                <li><a href="/admin/settings">Ustawienia systemu</a></li>
              </>
            )}
          </ul>
        </div>
        
        <div style={{ 
          border: "1px solid #ddd", 
          padding: "15px", 
          borderRadius: "8px",
          backgroundColor: "white"
        }}>
          <h4>Ostatnia aktywność</h4>
          <p>Brak ostatniej aktywności</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;