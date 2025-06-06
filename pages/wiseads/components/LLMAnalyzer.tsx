// src/pages/wiseads/components/LLMAnalyzer.tsx
import { useState } from "react";
import { z } from "zod";
import { LoadingOutlined, RobotOutlined } from '@ant-design/icons';
import { ErrorAlert } from "@/components/ui/ErrorAlert.js";

const LLM_ENDPOINT = "https://diesel-power-backend.onrender.com/api/chat";

// Definicja schematu Zod dla SiteData
const siteDataSchema = z.object({
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  keywords: z.array(z.string()).min(1, "Musi być co najmniej jedno słowo kluczowe"),
  industry: z.string().min(2, "Branża musi być określona"),
});

export type SiteData = z.infer<typeof siteDataSchema>;

interface LLMAnalyzerProps {
  onFetched: (url: string, data: SiteData) => void;
}

const LLMAnalyzer: React.FC<LLMAnalyzerProps> = ({ onFetched }) => {
  const [siteUrl, setSiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Funkcja pomocnicza do czyszczenia odpowiedzi LLM
  const stripCodeFences = (text: string): string => {
    return text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();
  };

  // Funkcja pomocnicza do walidacji URL
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const fetchSiteData = async (url: string): Promise<SiteData> => {
    if (!isValidUrl(url)) {
      throw new Error("Podaj poprawny adres URL (musi zaczynać się od http:// lub https://)");
    }

    const prompt = `
Przeanalizuj podaną stronę internetową i wygeneruj JSON z podstawowymi informacjami marketingowymi.

Dla podanego adresu URL: ${url}

Wygeneruj JSON w dokładnie tym formacie:
{
  "description": "<krótki, konkretny opis działalności strony (30-100 słów)>",
  "keywords": ["słowo1", "słowo2", "słowo3", "..."],
  "industry": "<konkretna branża/sektor>"
}

Wymagania:
- Opis powinien zawierać główne działanie/usługi firmy
- Słowa kluczowe (5-10 sztuk) powinny być związane z branżą i produktami/usługami
- Branża powinna być konkretna (np. "e-commerce mody", "usługi finansowe", "restauracja")
- Odpowiedz TYLKO JSON, bez dodatkowych komentarzy

URL do analizy: ${url}
    `.trim();

    try {
      const res = await fetch(LLM_ENDPOINT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!res.ok) {
        throw new Error(`Błąd serwera LLM: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      const rawText = (json.response as string) || "";
      
      if (!rawText.trim()) {
        throw new Error("Pusta odpowiedź z serwera LLM");
      }

      const cleaned = stripCodeFences(rawText);

      let parsed: unknown;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Błąd parsowania JSON:", parseError);
        console.error("Surowa odpowiedź:", rawText);
        console.error("Oczyszczona odpowiedź:", cleaned);
        throw new Error("Niepoprawny JSON: nie można sparsować odpowiedzi LLM");
      }

      const result = siteDataSchema.safeParse(parsed);
      if (!result.success) {
        console.error("Błąd walidacji Zod:", result.error);
        throw new Error("Niepoprawny format odpowiedzi LLM - brakuje wymaganych pól lub są niepoprawne");
      }

      return result.data;

    } catch (error: any) {
      console.error("Błąd w fetchSiteData:", error);
      throw error;
    }
  };

  const onAnalyze = async () => {
    setError("");
    
    if (!siteUrl?.trim()) {
      setError("Podaj adres URL strony");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchSiteData(siteUrl.trim());
      setLoading(false);
      
      onFetched(siteUrl.trim(), data);
      
    } catch (e: any) {
      setLoading(false);
      const errorMessage = e.message || "Wystąpił nieoczekiwany błąd podczas analizy";
      setError(errorMessage);
      console.error("LLMAnalyzer error:", e);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteUrl(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onAnalyze();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Krok header */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-6">
          Krok 1: Podaj adres strony internetowej
        </label>
      </div>
      
      {/* Error alert */}
      {error && (
        <ErrorAlert 
          message={error} 
          onClose={() => setError("")} 
        />
      )}

      {/* Input container */}
      <div className="space-y-4">
        <input
          type="url"
          value={siteUrl}
          onChange={handleUrlChange}
          onKeyPress={handleKeyPress}
          placeholder="https://twojafirma.pl"
          disabled={loading}
          className="w-full h-14 px-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingOutlined className="text-lg animate-spin" />
              <span>Analizuję...</span>
            </>
          ) : (
            "Analizuj stronę"
          )}
        </button>
      </div>
      
      {/* AI Section */}
      <div className="text-center mt-8 p-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <RobotOutlined className="text-xl text-white" />
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Przeanalizuję Twoją stronę i wygeneruję<br />
          podstawowe informacje potrzebne do kampanii
        </p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-6">
          <LoadingOutlined className="text-3xl text-blue-500 mb-4" />
          <div className="text-sm text-gray-500">
            To może potrwać kilka sekund...
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMAnalyzer;