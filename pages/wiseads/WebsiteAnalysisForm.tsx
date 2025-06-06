// src/pages/wiseads/WebsiteAnalysisForm.tsx - czyste style w stylu shadcn/ui
import React, { useState } from "react";
import { ConfigProvider, Space, Typography, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LLMAnalyzer, { SiteData } from "./components/LLMAnalyzer";
import DatabaseService from "./services/databaseService";

const { Title, Paragraph, Text } = Typography;

// Design tokens w stylu shadcn/ui
const theme = {
  colors: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    border: '#e2e8f0',
    success: '#16a34a',
    successForeground: '#ffffff',
    info: '#2563eb',
  },
  borderRadius: 8,
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
  },
  container: {
    maxWidth: 640,
    margin: '0 auto',
    width: '100%',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: theme.colors.foreground,
    margin: 0,
    letterSpacing: '-0.025em',
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
    margin: 0,
    lineHeight: 1.5,
  },
  backButton: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.foreground,
    borderRadius: theme.borderRadius,
    padding: '8px 12px',
    fontSize: 14,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  infoCard: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #22c55e',
    borderRadius: theme.borderRadius * 1.5,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontWeight: 600,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
    fontSize: 16,
  },
  infoList: {
    color: theme.colors.foreground,
    lineHeight: 1.6,
    fontSize: 14,
    margin: 0,
  },
  analyzerContainer: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius * 1.5,
    boxShadow: theme.shadows.sm,
    padding: theme.spacing.lg,
  },
};

const WebsiteAnalysisForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSiteDataFetched = async (url: string, data: SiteData) => {
    setLoading(true);
    try {
      // Zapisz analizę WWW do bazy danych
      const analysis = await DatabaseService.createWebsiteAnalysis({
        url: url,
        description: data.description,
        keywords: data.keywords,
        industry: data.industry,
      });

      // Przekieruj do szczegółów analizy
      navigate(`/analyses/${analysis.id}`);
    } catch (error: any) {
      console.error("Nie udało się zapisać analizy WWW:", error);
      // Można kontynuować bez zapisywania do bazy - pokaż błąd
    }
    setLoading(false);
  };

  return (
    <ConfigProvider>
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div style={styles.header}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={styles.backButton}
              >
                Powrót
              </Button>
              <h1 style={styles.headerTitle}>
                Nowa analiza WWW
              </h1>
              <p style={styles.headerSubtitle}>
                Przeanalizuj swoją stronę internetową za pomocą AI
              </p>
            </div>

            {/* Informacyjna karta */}
            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>
                Co się stanie po analizie?
              </div>
              <div style={styles.infoList}>
                • AI przeanalizuje Twoją stronę i wyciągnie kluczowe informacje<br/>
                • Zostanie utworzona analiza WWW w bazie danych<br/>
                • Będziesz mógł stworzyć strategie marketingowe dla tej strony<br/>
                • Na podstawie strategii będziesz mógł tworzyć kampanie Google Ads
              </div>
            </div>

            {/* Formularz analizy */}
            <div style={styles.analyzerContainer}>
              <LLMAnalyzer onFetched={handleSiteDataFetched} />
            </div>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WebsiteAnalysisForm;