// ===================================================================
// src/pages/beneficiary/RequestDetail.tsx
// ===================================================================

import { LoadingState, Alert, Hero, Card, InfoField, Button, Container, Section } from "@/components/ui/basic";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth";

export const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, delegatedUser } = useAuth();
  
  const currentUser = delegatedUser || user;
  const beneficiaryId = currentUser?.id;

  // Sprawdź czy użytkownik jest zalogowany
  if (!currentUser || !beneficiaryId) {
    return (
      <Container>
        <Alert type="error" title="Błąd" message="Nie można załadować danych użytkownika. Zaloguj się ponownie." />
      </Container>
    );
  }

  // Spróbuj pobrać jako service request
  const { data: serviceRequest, isLoading: loadingSR, error: errorSR } = useQuery({
    queryKey: ['service-request', id],
    queryFn: () => beneficiaryApi.getServiceRequestById(id!),
    enabled: !!id,
    retry: false,
  });

  // Spróbuj pobrać jako audit request
  const { data: auditRequests, isLoading: loadingAR, error: errorAR } = useQuery({
    queryKey: ['audit-requests', beneficiaryId],
    queryFn: () => beneficiaryApi.getAuditRequests(beneficiaryId),
    enabled: !!id && !serviceRequest && !loadingSR,
  });

  // Znajdź audit request po ID
  const auditRequest = auditRequests?.find(req => req.id === id);
  
  const isLoading = loadingSR || loadingAR;
  const request = serviceRequest || auditRequest;
  const requestType = serviceRequest ? 'service' : auditRequest ? 'audit' : null;

  const { mutate: acceptContractorOffer } = useMutation({
    mutationFn: beneficiaryApi.acceptContractorOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-request', id] });
    },
  });

  const { mutate: rejectContractorOffer } = useMutation({
    mutationFn: beneficiaryApi.rejectContractorOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-request', id] });
    },
  });

  const { mutate: acceptAuditorOffer } = useMutation({
    mutationFn: beneficiaryApi.acceptAuditorOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-requests', beneficiaryId] });
    },
  });

  const { mutate: rejectAuditorOffer } = useMutation({
    mutationFn: beneficiaryApi.rejectAuditorOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-requests', beneficiaryId] });
    },
  });

  if (isLoading) return <LoadingState size="lg" />;
  
  if (!request) {
    return (
      <Container>
        <Section>
          <Alert type="error" title="Błąd" message="Nie udało się załadować szczegółów zlecenia." />
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Hero 
        title={`Szczegóły Zlecenia ${requestType === 'service' ? 'Wykonawcy' : 'Audytora'}`}
        subtitle={`${request.city}, ${request.street_address}`} 
      />
      
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informacje o zleceniu */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Informacje o zleceniu</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    requestType === 'service' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {requestType === 'service' ? 'Wykonawca' : 'Audytor'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Kod pocztowy" value={request.postal_code} />
                  <InfoField label="Miasto" value={request.city} />
                  <InfoField label="Adres" value={request.street_address} />
                  <InfoField label="Telefon" value={request.phone_number} />
                  <InfoField 
                    label="Status" 
                    value={
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'verified' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'pending' ? 'Oczekujące' :
                         request.status === 'verified' ? 'Zweryfikowane' : 'Odrzucone'}
                      </span>
                    } 
                  />
                  <InfoField 
                    label="Data utworzenia" 
                    value={new Date(request.created_at).toLocaleDateString('pl')} 
                  />
                </div>

                {/* Parametry techniczne - tylko dla service requests */}
                {requestType === 'service' && serviceRequest && (
                  (serviceRequest.heat_source || serviceRequest.windows_count || serviceRequest.doors_count || 
                   serviceRequest.wall_insulation_m2 || serviceRequest.attic_insulation_m2) && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium mb-4">Parametry techniczne</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceRequest.heat_source && (
                          <InfoField 
                            label="Źródło ciepła" 
                            value={
                              serviceRequest.heat_source === 'pompa_ciepla' ? 'Pompa ciepła' :
                              serviceRequest.heat_source === 'piec_pellet' ? 'Piec na pellet' :
                              'Piec zgazowujący'
                            } 
                          />
                        )}
                        {serviceRequest.windows_count && (
                          <InfoField label="Liczba okien" value={serviceRequest.windows_count} />
                        )}
                        {serviceRequest.doors_count && (
                          <InfoField label="Liczba drzwi" value={serviceRequest.doors_count} />
                        )}
                        {serviceRequest.wall_insulation_m2 && (
                          <InfoField label="Izolacja ścian (m²)" value={serviceRequest.wall_insulation_m2} />
                        )}
                        {serviceRequest.attic_insulation_m2 && (
                          <InfoField label="Izolacja poddasza (m²)" value={serviceRequest.attic_insulation_m2} />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>

          {/* Akcje */}
          <div>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Akcje</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/beneficiary/my-requests')}
                  >
                    Powrót do listy
                  </Button>
                  {request.status === 'pending' && (
                    <Button variant="outline" className="w-full">
                      Edytuj zlecenie
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Oferty wykonawców */}
      {requestType === 'service' && serviceRequest?.contractor_offers && serviceRequest.contractor_offers.length > 0 && (
        <Section>
          <h3 className="text-lg font-semibold mb-4">Oferty wykonawców</h3>
          <div className="space-y-4">
            {serviceRequest.contractor_offers.map(offer => (
              <Card key={offer.id}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-lg">
                          {offer.price.toLocaleString('pl')} zł
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {offer.status === 'pending' ? 'Oczekująca' :
                           offer.status === 'accepted' ? 'Zaakceptowana' : 'Odrzucona'}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3">{offer.scope}</p>
                      <p className="text-sm text-slate-500">
                        Złożona: {new Date(offer.created_at).toLocaleDateString('pl')}
                      </p>
                    </div>
                    
                    {offer.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => acceptContractorOffer(offer.id)}
                        >
                          Akceptuj
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => rejectContractorOffer(offer.id)}
                        >
                          Odrzuć
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Oferty audytorów */}
      {requestType === 'audit' && auditRequest?.auditor_offers && auditRequest.auditor_offers.length > 0 && (
        <Section>
          <h3 className="text-lg font-semibold mb-4">Oferty audytorów</h3>
          <div className="space-y-4">
            {auditRequest.auditor_offers.map(offer => (
              <Card key={offer.id}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-lg">
                          {offer.price.toLocaleString('pl')} zł
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {offer.status === 'pending' ? 'Oczekująca' :
                           offer.status === 'accepted' ? 'Zaakceptowana' : 'Odrzucona'}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3">
                        Czas realizacji: {offer.duration_days} dni
                      </p>
                      <p className="text-sm text-slate-500">
                        Złożona: {new Date(offer.created_at).toLocaleDateString('pl')}
                      </p>
                    </div>
                    
                    {offer.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => acceptAuditorOffer(offer.id)}
                        >
                          Akceptuj
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => rejectAuditorOffer(offer.id)}
                        >
                          Odrzuć
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </Container>
  );
};