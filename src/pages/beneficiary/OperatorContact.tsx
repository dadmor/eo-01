// ===================================================================
// src/pages/beneficiary/OperatorContact.tsx
// ===================================================================

import { Hero, Alert, Card, Button, Container, Section } from "@/components/ui/basic";
import { Clock, FileText, Phone } from "lucide-react";
import { useState } from "react";

export const OperatorContact: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<typeof formData> = {};
    if (!formData.subject.trim()) e.subject = 'Temat jest wymagany';
    if (!formData.message.trim()) e.message = 'Wiadomość jest wymagana';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // TODO: Implement actual contact submission
      console.log('Wysyłanie wiadomości:', formData);
      setIsSubmitted(true);
      setFormData({ subject: '', message: '', priority: 'medium' });
    }
  };

  return (
    <Container>
      <Hero 
        title="Kontakt z Operatorem" 
        subtitle="Skontaktuj się z naszym zespołem wsparcia" 
      />
      
      <Section>
        {isSubmitted && (
          <Alert 
            type="success" 
            title="Wiadomość wysłana" 
            message="Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce." 
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formularz kontaktowy */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={onSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Temat</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, subject: e.target.value }));
                      setErrors(prev => ({ ...prev, subject: undefined }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                      errors.subject ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Krótko opisz problem lub pytanie"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priorytet</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      priority: e.target.value as 'low' | 'medium' | 'high' 
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Wiadomość</label>
                  <textarea
                    rows={8}
                    value={formData.message}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, message: e.target.value }));
                      setErrors(prev => ({ ...prev, message: undefined }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 resize-none ${
                      errors.message ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Opisz szczegółowo swoje pytanie lub problem..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <Button variant="primary" className="w-full">
                  Wyślij wiadomość
                </Button>
              </form>
            </Card>
          </div>

          {/* Informacje kontaktowe */}
          <div>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informacje kontaktowe</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Telefon</span>
                    </div>
                    <p className="text-slate-600">+48 800 123 456</p>
                    <p className="text-sm text-slate-500">Pon-Pt 8:00-16:00</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p className="text-slate-600">pomoc@e-operator.pl</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Czas odpowiedzi</span>
                    </div>
                    <p className="text-slate-600">Do 24 godzin</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Najczęstsze pytania</h3>
                <div className="space-y-3">
                  <details className="group">
                    <summary className="cursor-pointer font-medium">
                      Jak długo trwa weryfikacja zlecenia?
                    </summary>
                    <p className="text-sm text-slate-600 mt-2">
                      Weryfikacja zlecenia zwykle trwa 1-2 dni robocze.
                    </p>
                  </details>
                  
                  <details className="group">
                    <summary className="cursor-pointer font-medium">
                      Czy mogę anulować zlecenie?
                    </summary>
                    <p className="text-sm text-slate-600 mt-2">
                      Tak, zlecenia można anulować przed ich weryfikacją.
                    </p>
                  </details>
                  
                  <details className="group">
                    <summary className="cursor-pointer font-medium">
                      Jak wybrać najlepszą ofertę?
                    </summary>
                    <p className="text-sm text-slate-600 mt-2">
                      Porównaj ceny, zakres prac i opinie innych klientów.
                    </p>
                  </details>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </Container>
  );
};