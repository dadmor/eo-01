// src/pages/wiseads/components/Navigation.tsx - czyste style w stylu Tailwind CSS (shadcn/ui)
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd"; // Zachowujemy Button z Ant Design
import {
  DashboardOutlined,
  GlobalOutlined,
  BulbOutlined,
  RocketOutlined,
  BarChartOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import clsx from "clsx"; // Biblioteka do warunkowego łączenia klas, popularna w projektach z Tailwind

interface NavigationProps {
  onMobileMenuToggle?: () => void; // Zmieniono nazwę dla jasności
}

const menuItems = [
  {
    key: "/",
    href: "/",
    icon: <DashboardOutlined className="h-4 w-4" />,
    label: "Dashboard",
  },
  {
    key: "/analyses",
    href: "/analyses",
    icon: <GlobalOutlined className="h-4 w-4" />,
    label: "Analizy WWW",
  },
  {
    key: "/strategies",
    href: "/strategies",
    icon: <BulbOutlined className="h-4 w-4" />,
    label: "Strategie",
  },
  {
    key: "/campaigns",
    href: "/campaigns",
    icon: <RocketOutlined className="h-4 w-4" />,
    label: "Kampanie",
  },
  {
    key: "/analytics",
    href: "/analytics",
    icon: <BarChartOutlined className="h-4 w-4" />,
    label: "Analityka",
  },
];

const Navigation: React.FC<NavigationProps> = ({ onMobileMenuToggle }) => {
  const location = useLocation();

  const getActiveKey = () => {
    const path = location.pathname;
    // Dopasowuje najbardziej szczegółową ścieżkę
    const activeItem = [...menuItems]
      .reverse()
      .find(item => path.startsWith(item.key));
    return activeItem ? activeItem.key : "/";
  };

  const activeKey = getActiveKey();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            WISE.ADS
          </span>
        </Link>

        {/* Nawigacja Desktopowa */}
        <nav className="hidden flex-1 items-center gap-x-1 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={clsx(
                "flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                {
                  "bg-slate-100 text-slate-900": activeKey === item.key,
                  "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
                    activeKey !== item.key,
                }
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Przycisk menu mobilnego */}
        {onMobileMenuToggle && (
          <div className="flex flex-1 items-center justify-end md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={onMobileMenuToggle}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;