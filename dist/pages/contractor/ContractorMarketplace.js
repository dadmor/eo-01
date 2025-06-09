import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/contractor/ContractorMarketplace.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SearchFilter, SelectFilter } from '../../components/ui/form';
import { contractorApi } from './api/contractors';
import { Plus, MapPin, Clock } from 'lucide-react';
import { CardGrid, Container, EmptyState, ErrorState, Hero, LoadingState, Section } from '@/components/ui/basic';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { FilterBar } from '@/components/ui/table';
import { ServiceRequestCard } from '@/components/ServiceRequestCard';
export const ContractorMarketplace = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { data: serviceRequests = [], isLoading, error, refetch } = useQuery({
        queryKey: ['service-requests'],
        queryFn: contractorApi.getServiceRequests,
    });
    const filteredRequests = serviceRequests.filter(request => {
        const matchesSearch = !searchTerm ||
            request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter ||
            request.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
            request.postal_code?.includes(locationFilter);
        // statusFilter można dodać analogicznie, jeśli backend wspiera
        return matchesSearch && matchesLocation;
    });
    const locationOptions = Array.from(new Set(serviceRequests.map(r => r.city).filter(Boolean))).map(city => ({ value: city, label: city }));
    const todayStr = new Date().toDateString();
    const newTodayCount = serviceRequests.filter(r => new Date(r.created_at).toDateString() === todayStr).length;
    if (isLoading) {
        return _jsx(LoadingState, { size: "lg" });
    }
    if (error) {
        return (_jsx(ErrorState, { title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 zlece\u0144 z marketplace", onRetry: () => refetch() }));
    }
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Gie\u0142da Wykonawc\u00F3w", subtitle: "Znajd\u017A zlecenia dopasowane do Twoich umiej\u0119tno\u015Bci" }), _jsx(Section, { children: _jsx(StatsGrid, { items: [
                        {
                            icon: _jsx(Plus, {}),
                            title: 'Dostępne zlecenia',
                            value: filteredRequests.length,
                            subtitle: 'aktywnych ofert',
                            color: 'blue',
                        },
                        {
                            icon: _jsx(MapPin, {}),
                            title: 'Lokalizacje',
                            value: locationOptions.length,
                            subtitle: 'różnych miast',
                            color: 'green',
                        },
                        {
                            icon: _jsx(Clock, {}),
                            title: 'Nowe dzisiaj',
                            value: newTodayCount,
                            subtitle: 'dodanych dziś',
                            color: 'purple',
                        },
                    ], colsMobile: 1, colsDesktop: 3 }) }), _jsx(Section, { children: _jsxs(FilterBar, { children: [_jsx(SearchFilter, { value: searchTerm, onChange: setSearchTerm, placeholder: "Szukaj zlece\u0144..." }), _jsx(SelectFilter, { options: locationOptions, value: locationFilter, onChange: value => setLocationFilter(value), placeholder: "Wybierz miasto" }), _jsx(SelectFilter, { options: [
                                { value: 'new', label: 'Nowe' },
                                { value: 'urgent', label: 'Pilne' },
                                { value: 'featured', label: 'Wyróżnione' },
                            ], value: statusFilter, onChange: value => setStatusFilter(value), placeholder: "Status zlecenia" })] }) }), _jsx(Section, { children: filteredRequests.length > 0 ? (_jsx(CardGrid, { children: filteredRequests.map(req => (_jsx(ServiceRequestCard, { request: req, onOffer: id => navigate(`/contractor/offersform?requestId=${id}`), onDetails: id => navigate(`/contractor/marketplace/${id}`) }, req.id))) })) : (_jsx(EmptyState, { icon: _jsx(Plus, {}), title: "Brak zlece\u0144", message: "Nie znaleziono zlece\u0144 spe\u0142niaj\u0105cych wybrane kryteria." })) })] }));
};
