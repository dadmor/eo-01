// src/pages/operator/OperatorContacts.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Button,
  LoadingSpinner,
  Alert,
  StatCard,
} from "../../components/ui/basic";
import { SearchFilter, SelectFilter } from "../../components/ui/form";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { operatorApi, UserContact } from "./api/operator";

const roleLabels = {
  beneficiary: "Beneficjent",
  contractor: "Wykonawca",
  auditor: "Audytor",
  operator: "Operator",
  admin: "Administrator",
} as const;

const roleColors = {
  beneficiary: "blue",
  contractor: "green",
  auditor: "purple",
  operator: "orange",
  admin: "red",
} as const;

export const OperatorContacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const {
    data: contacts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["operator-contacts"],
    queryFn: operatorApi.getUserContacts,
  });

  const filteredContacts = contacts.filter((contact: UserContact) => {
    const matchesSearch =
      !searchTerm ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone_number?.includes(searchTerm);

    const matchesRole = !roleFilter || contact.role === roleFilter;

    const matchesLocation =
      !locationFilter ||
      contact.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      contact.postal_code?.includes(locationFilter);

    return matchesSearch && matchesRole && matchesLocation;
  });

  const stats = {
    total: contacts.length,
    beneficiaries: contacts.filter((c) => c.role === "beneficiary").length,
    contractors: contacts.filter((c) => c.role === "contractor").length,
    auditors: contacts.filter((c) => c.role === "auditor").length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          title="Błąd ładowania"
          message="Nie udało się załadować kontaktów użytkowników"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Kontakty Użytkowników
        </h1>
        <p className="text-slate-600 mt-1">
          Przeglądaj i zarządzaj kontaktami wszystkich użytkowników
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<User className="w-5 h-5" />}
          title="Wszyscy"
          value={stats.total}
          subtitle="użytkowników"
          color="blue"
        />
        <StatCard
          icon={<User className="w-5 h-5" />}
          title="Beneficjenci"
          value={stats.beneficiaries}
          subtitle="zarejestrowanych"
          color="green"
        />
        <StatCard
          icon={<User className="w-5 h-5" />}
          title="Wykonawcy"
          value={stats.contractors}
          subtitle="aktywnych"
          color="purple"
        />
        <StatCard
          icon={<User className="w-5 h-5" />}
          title="Audytorzy"
          value={stats.auditors}
          subtitle="certyfikowanych"
         
        />
      </div>

      {/* Filtry */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchFilter
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Szukaj po nazwie, email lub telefonie..."
            />
            <SelectFilter
              options={[
                { value: "beneficiary", label: "Beneficjenci" },
                { value: "contractor", label: "Wykonawcy" },
                { value: "auditor", label: "Audytorzy" },
                { value: "operator", label: "Operatorzy" },
                { value: "admin", label: "Administratorzy" },
              ]}
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as string)}
              placeholder="Rola"
            />
            <SelectFilter
              options={Array.from(
                new Set(contacts.map((contact) => contact.city).filter(Boolean))
              ).map((city) => ({ value: city!, label: city! }))}
              value={locationFilter}
              onChange={(value) => setLocationFilter(value as string)}
              placeholder="Miasto"
            />
          </div>
        </div>
      </Card>

      {/* Lista kontaktów */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {contact.name || "Nie podano"}
                    </h3>
                    {/* <Badge
                      color={
                        roleColors[contact.role as keyof typeof roleColors]
                      }
                      variant="soft"
                    >
                      {roleLabels[contact.role as keyof typeof roleLabels]}
                    </Badge> */}
                    TODO -BADGE
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>

                    {contact.phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone_number}</span>
                      </div>
                    )}

                    {contact.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {contact.city} {contact.postal_code}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Dołączył:{" "}
                        {new Date(contact.created_at).toLocaleDateString("pl")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${contact.email}`)}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                {contact.phone_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${contact.phone_number}`)}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Telefon
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Brak kontaktów
            </h3>
            <p className="text-slate-600">
              Nie znaleziono kontaktów spełniających wybrane kryteria.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
