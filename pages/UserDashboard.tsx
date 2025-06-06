// src/pages/UserDashboard.tsx
import React from "react";
import { Card } from "antd";
import CampaignForm from "./wiseads/CampaignForm.js";

const UserDashboard: React.FC = () => (
  <Card title="Panel Użytkownika">
    <p>Witaj! To jest Twój dashboard użytkownika.</p>
    {/* Możesz tu wyświetlić listę własnych zasobów, powiadomień itp. */}
    <CampaignForm />
  </Card>
);

export default UserDashboard;
