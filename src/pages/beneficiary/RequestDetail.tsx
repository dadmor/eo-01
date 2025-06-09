// ===================================================================
// src/pages/beneficiary/RequestDetail.tsx
// ===================================================================

import { LoadingState, Alert, Hero, Card, InfoField, Button, Container, Section } from "@/components/ui/basic";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Home, 
  Thermometer, 
  Square, 
  DoorOpen,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Euro,
  User,
  ArrowLeft,
  Edit3
} from "lucide-react";

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

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'verified': return 'bg-green-50 text-green-700 border-green-200';
      case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Oczekujące';
      case 'verified': return 'Zweryfikowane';
      case 'accepted': return 'Zaakceptowane';
      default: return 'Odrzucone';
    }
  };

  const getHeatSourceIcon = (heatSource: string) => {
    return <Thermometer className="w-4 h-4 text-orange-600" />;
  };

  const getHeatSourceText = (heatSource: string) => {
    switch (heatSource) {
      case 'pompa_ciepla': return 'Pompa ciepła';
      case 'piec_pellet': return 'Piec na pellet';
      default: return 'Piec zgazowujący';
    }
  };

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
      {/* Header z breadcrumb */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/beneficiary/my-requests')}
          className="mb-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do listy
        </Button>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Szczegóły Zlecenia</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              requestType === 'service' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {requestType === 'service' ? 'Wykonawca' : 'Audytor'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{request.city}, {request.street_address}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Główne informacje */}
        <div className="xl:col-span-3 space-y-6">
          {/* Status i podstawowe informacje */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Informacje podstawowe</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span>{getStatusText(request.status)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Kod pocztowy</div>
                    <div className="font-medium">{request.postal_code}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Miasto</div>
                    <div className="font-medium">{request.city}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Adres</div>
                    <div className="font-medium">{request.street_address}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Telefon</div>
                    <div className="font-medium">{request.phone_number}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Data utworzenia</div>
                    <div className="font-medium">{new Date(request.created_at).toLocaleDateString('pl')}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Parametry techniczne - tylko dla service requests */}
          {requestType === 'service' && serviceRequest && (
            (serviceRequest.heat_source || serviceRequest.windows_count || serviceRequest.doors_count || 
             serviceRequest.wall_insulation_m2 || serviceRequest.attic_insulation_m2) && (
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Parametry techniczne</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceRequest.heat_source && (
                      <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                        {getHeatSourceIcon(serviceRequest.heat_source)}
                        <div>
                          <div className="text-sm text-orange-600 font-medium">Źródło ciepła</div>
                          <div className="font-semibold text-orange-800">
                            {getHeatSourceText(serviceRequest.heat_source)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {serviceRequest.windows_count && (
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Square className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-blue-600 font-medium">Liczba okien</div>
                          <div className="font-semibold text-blue-800">{serviceRequest.windows_count}</div>
                        </div>
                      </div>
                    )}
                    
                    {serviceRequest.doors_count && (
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                        <DoorOpen className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-green-600 font-medium">Liczba drzwi</div>
                          <div className="font-semibold text-green-800">{serviceRequest.doors_count}</div>
                        </div>
                      </div>
                    )}
                    
                    {serviceRequest.wall_insulation_m2 && (
                      <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-purple-600 font-medium">Izolacja ścian</div>
                          <div className="font-semibold text-purple-800">{serviceRequest.wall_insulation_m2} m²</div>
                        </div>
                      </div>
                    )}
                    
                    {serviceRequest.attic_insulation_m2 && (
                      <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <Home className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-indigo-600 font-medium">Izolacja poddasza</div>
                          <div className="font-semibold text-indigo-800">{serviceRequest.attic_insulation_m2} m²</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          )}

          {/* Oferty wykonawców */}
          {requestType === 'service' && serviceRequest?.contractor_offers && serviceRequest.contractor_offers.length > 0 && (
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Oferty wykonawców ({serviceRequest.contractor_offers.length})
                </h3>
                <div className="space-y-4">
                  {serviceRequest.contractor_offers.map(offer => (
                    <div key={offer.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Euro className="w-5 h-5 text-green-600" />
                              <span className="font-bold text-2xl text-green-700">
                                {offer.price.toLocaleString('pl')} zł
                              </span>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offer.status)}`}>
                              {getStatusIcon(offer.status)}
                              <span>{getStatusText(offer.status)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 rounded-lg p-4 mb-3">
                            <div className="text-sm text-slate-600 font-medium mb-1">Zakres prac:</div>
                            <p className="text-slate-700">{offer.scope}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span>Złożona: {new Date(offer.created_at).toLocaleDateString('pl')}</span>
                          </div>
                        </div>
                        
                        {offer.status === 'pending' && (
                          <div className="flex gap-2 ml-6">
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => acceptContractorOffer(offer.id)}
                              className="inline-flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Akceptuj
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => rejectContractorOffer(offer.id)}
                              className="inline-flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Odrzuć
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Oferty audytorów */}
          {requestType === 'audit' && auditRequest?.auditor_offers && auditRequest.auditor_offers.length > 0 && (
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Oferty audytorów ({auditRequest.auditor_offers.length})
                </h3>
                <div className="space-y-4">
                  {auditRequest.auditor_offers.map(offer => (
                    <div key={offer.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Euro className="w-5 h-5 text-purple-600" />
                              <span className="font-bold text-2xl text-purple-700">
                                {offer.price.toLocaleString('pl')} zł
                              </span>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offer.status)}`}>
                              {getStatusIcon(offer.status)}
                              <span>{getStatusText(offer.status)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-4 mb-3">
                            <div className="flex items-center gap-2 text-purple-700">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">Czas realizacji: {offer.duration_days} dni</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span>Złożona: {new Date(offer.created_at).toLocaleDateString('pl')}</span>
                          </div>
                        </div>
                        
                        {offer.status === 'pending' && (
                          <div className="flex gap-2 ml-6">
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => acceptAuditorOffer(offer.id)}
                              className="inline-flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Akceptuj
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => rejectAuditorOffer(offer.id)}
                              className="inline-flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Odrzuć
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar z akcjami */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Szybkie akcje</h3>
                <div className="space-y-3">
                  {request.status === 'pending' && (
                    <Button 
                      variant="primary" 
                      className="w-full inline-flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edytuj zlecenie
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/beneficiary/operator-contact')}
                  >
                    Kontakt z operatorem
                  </Button>
                </div>
              </div>
            </Card>

            {/* Informacje pomocnicze */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informacje</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-800 mb-1">Status zlecenia</div>
                    <div className="text-blue-700">
                      {request.status === 'pending' && 'Zlecenie oczekuje na weryfikację przez operatora.'}
                      {request.status === 'verified' && 'Zlecenie zostało zweryfikowane i jest dostępne dla wykonawców.'}
                      {request.status === 'rejected' && 'Zlecenie zostało odrzucone. Skontaktuj się z operatorem.'}
                    </div>
                  </div>
                  
                  {requestType === 'service' && serviceRequest?.contractor_offers && serviceRequest.contractor_offers.length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-medium text-green-800 mb-1">Otrzymane oferty</div>
                      <div className="text-green-700">
                        Masz {serviceRequest.contractor_offers.length} ofert od wykonawców. 
                        Porównaj je i wybierz najlepszą.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};