// src/pages/wiseads/StrategyForm.tsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Space, Spin, Alert, Select, InputNumber, Tag, Descriptions } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { z } from "zod";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { MainCard } from "@/components/ui/website/MainCard.js";
import { SectionTitle } from "@/components/ui/website/SectionTitle.js";
import { ActionButton } from "@/components/ui/website/ActionButton.js";
import { WebsiteAnalysis } from "./types/database.js";
import DatabaseService from "./services/databaseService.js";

const { TextArea } = Input;
const { Option } = Select;

// Schema walidacji
const strategySchema = z.object({
  title: z.string().min(5, "Tytuł musi mieć co najmniej 5 znaków"),
  target_audience: z.string().min(20, "Opis grupy docelowej musi być szczegółowy"),
  budget_recommendation: z.number().min(500, "Minimalny budżet to 500 PLN"),
  notes: z.string().min(50, "Notatki muszą być szczegółowe"),
  industry_override: z.string().optional(),
});

interface StrategyFormData {
  title: string;
  target_audience: string;
  budget_recommendation: number;
  notes: string;
  industry_override?: string;
}

const StrategyForm: React.FC = () => {
  const navigate = useNavigate();
  const { websiteId, id: strategyId } = useParams();
  const [form] = Form.useForm();

  const [website, setWebsite] = useState<WebsiteAnalysis | null>(null);
  const [websites, setWebsites] = useState<WebsiteAnalysis[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>(websiteId || "");
  const [loading, setLoading] = useState(false);
  const [loadingWebsites, setLoadingWebsites] = useState(false);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Wczytaj stronę WWW jeśli jest przekazana w URL
  const loadWebsite = async (id: string) => {
    try {
      const websiteData = await DatabaseService.getWebsiteAnalysis(id);
      if (websiteData) {
        setWebsite(websiteData);
      }
    } catch (error: any) {
      console.error("Błąd ładowania strony:", error);
      setError("Nie można załadować analizy strony");
    }
  };

  // Wczytaj wszystkie strony jeśli tworzymy nową strategię bez wybranej strony
  const loadAllWebsites = async () => {
    setLoadingWebsites(true);
    try {
      const websitesData = await DatabaseService.getAllWebsiteAnalyses();
      setWebsites(websitesData);
    } catch (error: any) {
      console.error("Błąd ładowania stron:", error);
      setError("Nie można załadować analiz stron");
    }
    setLoadingWebsites(false);
  };

  // Wczytaj dane strategii do edycji
  const loadStrategy = async (id: string) => {
    try {
      setIsEditing(true);
      const strategyData = await DatabaseService.getMarketingStrategy(id);
      if (strategyData) {
        setWebsite(strategyData.website_analysis);
        setSelectedWebsiteId(strategyData.website_analysis_id);

        form.setFieldsValue({
          title: strategyData.title,
          target_audience: strategyData.target_audience,
          budget_recommendation: strategyData.budget_recommendation,
          notes: strategyData.notes,
          industry_override: strategyData.industry_override || "",
        });
      }
    } catch (error: any) {
      console.error("Błąd ładowania strategii:", error);
      setError("Nie można załadować strategii");
    }
  };

  useEffect(() => {
    if (strategyId) {
      loadStrategy(strategyId);
    } else if (websiteId) {
      loadWebsite(websiteId);
    } else {
      loadAllWebsites();
    }
  }, [websiteId, strategyId]);

  // Obsługa zmiany strony WWW
  const handleWebsiteChange = async (newWebsiteId: string) => {
    setSelectedWebsiteId(newWebsiteId);
    await loadWebsite(newWebsiteId);
  };

  // Generowanie strategii przez AI
  const generateStrategy = async () => {
    if (!website) return;

    setGenerating(true);
    try {
      const prompt = `
Jesteś ekspertem od marketingu cyfrowego. Na podstawie poniższych informacji o stronie internetowej, wygeneruj szczegółową strategię marketingową w formacie JSON:

Informacje o stronie:
- URL: ${website.url}
- Opis: ${website.description}
- Słowa kluczowe: ${website.keywords.join(", ")}
- Branża: ${website.industry}

Wygeneruj JSON w dokładnie tym formacie:
{
  "title": "<kreatywny tytuł strategii dopasowany do branży>",
  "target_audience": "<bardzo szczegółowy opis grupy docelowej z demografią, zainteresowaniami, zachowaniami online, lokalizacją>",
  "budget_recommendation": <liczba - sugerowany budżet miesięczny w PLN>,
  "notes": "<szczegółowe notatki strategiczne zawierające: kanały marketingowe, timing kampanii, propozycje content marketingu, strategię SEO/SEM, social media, email marketing, metryki KPI, plan testów A/B, konkurencję, USP>"
}

Uwagi:
- Tytuł powinien być angażujący i strategiczny
- Grupa docelowa bardzo konkretna (wiek, płeć, wykształcenie, zainteresowania, zachowania)
- Budżet realistyczny dla branży (1000-50000 PLN)
- Notatki bardzo szczegółowe (min. 300 słów) z konkretnymi działaniami
      `.trim();

      const res = await fetch("https://diesel-power-backend.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!res.ok) {
        throw new Error(`Błąd serwera LLM: ${res.status}`);
      }

      const json = await res.json();
      const rawText = (json.response as string) || "";
      const cleaned = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();

      const parsed = JSON.parse(cleaned);
      const result = strategySchema.safeParse(parsed);

      if (!result.success) {
        throw new Error("Niepoprawny format odpowiedzi AI");
      }

      form.setFieldsValue(result.data);
    } catch (error: any) {
      console.error("Błąd generowania strategii:", error);
      setError("Nie udało się wygenerować strategii. Wypełnij formularz ręcznie.");
    }
    setGenerating(false);
  };

  // Submisja formularza
  const handleSubmit = async (values: StrategyFormData) => {
    if (!selectedWebsiteId) {
      setError("Wybierz analizę strony WWW");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const strategyData: MarketingStrategyInsert = {
        website_analysis_id: selectedWebsiteId,
        title: values.title,
        target_audience: values.target_audience,
        budget_recommendation: values.budget_recommendation,
        notes: values.notes,
        industry_override: values.industry_override || undefined,
      };

      if (isEditing && strategyId) {
        await DatabaseService.updateMarketingStrategy(strategyId, strategyData);
      } else {
        await DatabaseService.createMarketingStrategy(strategyData);
      }

      navigate("/strategies");
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  if (loadingWebsites) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <Spin size="large" tip="Ładowanie analiz stron..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <ActionButton onClick={() => navigate(-1)} variant="secondary" icon={<ArrowLeftOutlined />}>
            Powrót
          </ActionButton>
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edytuj strategię" : "Nowa strategia marketingowa"}
          </h2>
        </div>

        {error && (
          <Alert
            message="Błąd"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
          />
        )}

        {/* Wybór strony WWW */}
        {!websiteId && !isEditing && (
          <MainCard>
            <SectionTitle>Wybierz analizę strony WWW</SectionTitle>
            <Select
              size="large"
              placeholder="Wybierz analizę..."
              className="w-full mt-4"
              value={selectedWebsiteId}
              onChange={handleWebsiteChange}
              optionLabelProp="label"
            >
              {websites.map((site) => (
                <Option key={site.id} value={site.id} label={site.url}>
                  <div>
                    <div className="font-medium">{site.url}</div>
                    <div className="text-xs text-gray-500">{site.industry} • {site.description.slice(0, 50)}...</div>
                  </div>
                </Option>
              ))}
            </Select>
          </MainCard>
        )}

        {/* Informacje o stronie */}
        {website && (
          <MainCard>
            <SectionTitle>Bazowa analiza WWW</SectionTitle>
            <Descriptions column={2} size="small" className="mt-4">
              <Descriptions.Item label="URL">
                <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {website.url}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Branża">
                <Tag color="purple">{website.industry}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Opis" span={2}>
                {website.description}
              </Descriptions.Item>
              <Descriptions.Item label="Słowa kluczowe" span={2}>
                <div className="flex flex-wrap gap-2">
                  {website.keywords.map((keyword, index) => (
                    <Tag key={index} color="blue">{keyword}</Tag>
                  ))}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </MainCard>
        )}

        {/* Formularz strategii */}
        {website && (
          <MainCard>
            <div className="flex items-center justify-between">
              <SectionTitle>Parametry strategii</SectionTitle>
              {!isEditing && (
                <Button type="dashed" onClick={generateStrategy} loading={generating}>
                  {generating ? "Generuję AI..." : "Generuj przez AI"}
                </Button>
              )}
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ budget_recommendation: 5000 }}
              className="mt-6"
            >
              <Form.Item
                name="title"
                label="Tytuł strategii"
                rules={[{ required: true, message: "Wprowadź tytuł strategii" }]}
              >
                <Input size="large" placeholder="Np. Strategia digital marketing - E-commerce moda" />
              </Form.Item>

              <Form.Item
                name="industry_override"
                label="Branża (opcjonalnie - nadpisuje analizę WWW)"
              >
                <Input size="large" placeholder={`Domyślnie: ${website.industry}`} />
              </Form.Item>

              <Form.Item
                name="budget_recommendation"
                label="Sugerowany budżet miesięczny (PLN)"
                rules={[
                  { required: true, message: "Podaj rekomendację budżetu" },
                  { type: "number", min: 500, message: "Minimalny budżet to 500 PLN" },
                ]}
              >
                <InputNumber
                  size="large"
                  className="w-full"
                  min={500}
                  max={100000}
                  step={500}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  addonAfter="PLN"
                />
              </Form.Item>

              <Form.Item
                name="target_audience"
                label="Grupa docelowa"
                rules={[{ required: true, message: "Opisz grupę docelową" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Szczegółowy opis grupy docelowej: wiek, płeć, zainteresowania, zachowania online, lokalizacja, status społeczno-ekonomiczny..."
                />
              </Form.Item>

              <Form.Item
                name="notes"
                label="Notatki strategiczne"
                rules={[{ required: true, message: "Dodaj szczegółowe notatki" }]}
              >
                <TextArea
                  rows={8}
                  placeholder="Szczegółowe notatki strategiczne: kanały marketingowe, timing, content marketing, SEO/SEM, social media, email marketing, KPI, testy A/B, analiza konkurencji, USP..."
                />
              </Form.Item>

              <Form.Item className="mt-8">
                <Space direction="vertical" className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    {loading ? (
                      <Space>
                        <Spin size="small" />
                        <span>{isEditing ? "Zapisuję..." : "Tworzę strategię..."}</span>
                      </Space>
                    ) : (
                      isEditing ? "Zapisz zmiany" : "Utwórz strategię"
                    )}
                  </Button>
                  <Button
                    block
                    size="large"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Anuluj
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </MainCard>
        )}
      </div>
    </PageContainer>
  );
};

export default StrategyForm;
