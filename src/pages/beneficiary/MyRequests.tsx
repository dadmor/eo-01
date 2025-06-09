// src/pages/beneficiary/MyRequests.tsx - POPRAWIONA WERSJA
import { LoadingState, Alert, Hero, StatCard, Button, Card, EmptyState, Container, Section } from "@/components/ui/basic";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth";

export const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const { user, delegatedUser, loading: authLoading } = useAuth();
  
  // Użyj delegatedUser jeśli istnieje, w przeciwnym razie user
  const currentUser = delegatedUser || user;
  const beneficiaryId = currentUser?.id;

  // ✅ HOOKI MUSZĄ BYĆ ZAWSZE WYWOŁANE - używamy enabled do kontrolowania zapytań
  const { data: serviceRequests = [], isLoading: loadingSR, error: errorSR } = useQuery({
    queryKey: ['service-requests', beneficiaryId],
    queryFn: () => beneficiaryApi.getServiceRequests(beneficiaryId!),
    enabled: !!beneficiaryId, // Zapytanie wykonuje się tylko gdy mamy ID
  });

  const { data: auditRequests = [], isLoading: loadingAR, error: errorAR } = useQuery({
    queryKey: ['audit-requests', beneficiaryId],
    queryFn: () => beneficiaryApi.getAuditRequests(beneficiaryId!),
    enabled: !!beneficiaryId, // Zapytanie wykonuje się tylko gdy mamy ID
  });

  const isLoading = loadingSR || loadingAR;
  const error = errorSR || errorAR;

  // ✅ Sprawdź czy auth się jeszcze ładuje
  if (authLoading) {
    return <LoadingState size="lg" />;
  }

  // ✅ Early return DOPIERO PO wszystkich hookach i sprawdzeniu loading
  if (!currentUser || !beneficiaryId) {
    return (
      <Container>
        <Alert type="error" title="Błąd" message="Nie można załadować danych użytkownika. Zaloguj się ponownie." />
      </Container>
    );
  }

  if (isLoading) {
    return <LoadingState size="lg" />;
  }

  if (error) {
    return (
      <Container>
        <Section>
          <Alert type="error" title="Błąd" message="Nie udało się załadować zleceń." />
        </Section>
      </Container>
    );
  }

  const allRequests = [
    ...serviceRequests.map(r => ({ ...r, type: 'service' as const })),
    ...auditRequests.map(r => ({ ...r, type: 'audit' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Container>
      <Hero title="Moje Zlecenia" subtitle="Zarządzaj swoimi zleceniami" />
      
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<FileText />} 
            title="Wszystkie" 
            value={allRequests.length} 
          />
          <StatCard 
            icon={<Clock />} 
            title="Oczekujące" 
            value={allRequests.filter(r => r.status === 'pending').length} 
            color="yellow" 
          />
          <StatCard 
            icon={<CheckCircle />} 
            title="Zweryfikowane" 
            value={allRequests.filter(r => r.status === 'verified').length} 
            color="green" 
          />
        </div>
      </Section>

      <Section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Lista zleceń</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/beneficiary/service-request')}
            >
              Nowe zlecenie wykonawcy
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/beneficiary/audit-request')}
            >
              Nowe zlecenie audytora
            </Button>
          </div>
        </div>

        {allRequests.length > 0 ? (
          <div className="space-y-4">
            {allRequests.map(req => (
              <Card key={`${req.type}-${req.id}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          req.type === 'service' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {req.type === 'service' ? 'Wykonawca' : 'Audytor'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'verified' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status === 'pending' ? 'Oczekujące' :
                           req.status === 'verified' ? 'Zweryfikowane' : 'Odrzucone'}
                        </span>
                      </div>
                      <h3 className="font-medium text-lg">{req.city}, {req.street_address}</h3>
                      <p className="text-slate-600">{req.postal_code}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/beneficiary/requests/${req.id}`)}
                    >
                      Szczegóły
                    </Button>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    Utworzone: {new Date(req.created_at).toLocaleDateString('pl')}
                  </div>
                  
                  {req.type === 'service' && (req as any).contractor_offers?.length > 0 && (
                    <div className="mt-3 text-sm">
                      <span className="text-green-600 font-medium">
                        {(req as any).contractor_offers.length} ofert
                      </span>
                    </div>
                  )}
                  
                  {req.type === 'audit' && (req as any).auditor_offers?.length > 0 && (
                    <div className="mt-3 text-sm">
                      <span className="text-green-600 font-medium">
                        {(req as any).auditor_offers.length} ofert
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText />}
            title="Brak zleceń"
            message="Nie masz jeszcze żadnych zleceń."
          />
        )}
      </Section>
    </Container>
  );
};