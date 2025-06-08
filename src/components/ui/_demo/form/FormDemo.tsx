import React, { useState } from 'react';
import { Search, X, ChevronDown, User, Mail, Phone, Building, Save, RotateCcw } from 'lucide-react';

// Hook useSimpleForm (w prawdziwym projekcie byłby importowany)
const useSimpleForm = () => {
  const getFormData = (form: HTMLFormElement) => {
    const data: Record<string, string | string[]> = {};
    
    // Obsługa input[name]
    const inputs = form.querySelectorAll('input[name]') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        if (!data[input.name]) {
          data[input.name] = [];
        }
        if (input.checked) {
          (data[input.name] as string[]).push(input.value);
        }
      } else if (input.type === 'radio') {
        if (input.checked) {
          data[input.name] = input.value;
        }
      } else {
        data[input.name] = input.value;
      }
    });
    
    // Obsługa select[name]
    const selects = form.querySelectorAll('select[name]') as NodeListOf<HTMLSelectElement>;
    selects.forEach(select => {
      if (select.multiple) {
        const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
        data[select.name] = selectedOptions;
      } else {
        data[select.name] = select.value;
      }
    });
    
    // Obsługa textarea[name]
    const textareas = form.querySelectorAll('textarea[name]') as NodeListOf<HTMLTextAreaElement>;
    textareas.forEach(textarea => {
      data[textarea.name] = textarea.value;
    });
    
    return data;
  };

  const resetForm = (form: HTMLFormElement) => {
    form.reset();
  };

  const setFormData = (form: HTMLFormElement, data: Record<string, string | string[]>) => {
    Object.entries(data).forEach(([name, value]) => {
      const elements = form.querySelectorAll(`[name="${name}"]`) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
      
      elements.forEach(element => {
        if (element instanceof HTMLInputElement) {
          if (element.type === 'checkbox') {
            element.checked = Array.isArray(value) ? value.includes(element.value) : value === element.value;
          } else if (element.type === 'radio') {
            element.checked = element.value === value;
          } else {
            element.value = Array.isArray(value) ? value.join(', ') : value;
          }
        } else if (element instanceof HTMLSelectElement) {
          if (element.multiple && Array.isArray(value)) {
            Array.from(element.options).forEach(option => {
              option.selected = value.includes(option.value);
            });
          } else {
            element.value = Array.isArray(value) ? value[0] || '' : value;
          }
        } else if (element instanceof HTMLTextAreaElement) {
          element.value = Array.isArray(value) ? value.join('\n') : value;
        }
      });
    });
  };

  return { getFormData, resetForm, setFormData };
};

// Komponenty formularza z klasycznymi elementami HTML
const SearchFilter = ({ value, onChange, placeholder = "Szukaj...", name, clearable = true }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent w-full"
      />
      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange?.("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const SelectFilter = ({ options, value, onChange, placeholder = "Wybierz...", multiple = false, name }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      onChange?.(selectedOptions);
    } else {
      onChange?.(e.target.value);
    }
  };

  if (multiple) {
    return (
      <div className="relative">
        <select
          name={name}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent min-h-[2.5rem] max-h-32"
          size={Math.min(options.length, 6)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {Array.isArray(value) && value.length > 0 && (
          <div className="mt-1 text-xs text-slate-600">
            Wybrano: {value.length} {value.length === 1 ? 'element' : 'elementów'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none pr-10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

const CheckboxGroup = ({ options, value = [], onChange, name, layout = "vertical" }) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const newValue = [...value, optionValue];
      onChange?.(newValue);
    } else {
      const newValue = value.filter(v => v !== optionValue);
      onChange?.(newValue);
    }
  };

  const layoutClasses = {
    vertical: "flex flex-col gap-2",
    horizontal: "flex flex-wrap gap-4",
    grid: "grid grid-cols-2 gap-2"
  };

  return (
    <div className={layoutClasses[layout]}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
          />
          <span className="text-sm text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

const RadioGroup = ({ options, value, onChange, name, layout = "vertical" }) => {
  const layoutClasses = {
    vertical: "flex flex-col gap-2",
    horizontal: "flex flex-wrap gap-4",
    grid: "grid grid-cols-2 gap-2"
  };

  return (
    <div className={layoutClasses[layout]}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className="border-slate-300 text-slate-900 focus:ring-slate-500"
          />
          <span className="text-sm text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

// Demo Component
export default function FormDemoWithClassicElements() {
  const { getFormData, resetForm, setFormData } = useSimpleForm();
  const [formData, setFormDataState] = useState({});
  
  // State dla kontrolowanych komponentów (opcjonalne)
  const [searchValue, setSearchValue] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const companies = [
    { value: "tech-corp", label: "Tech Corp" },
    { value: "design-studio", label: "Design Studio" },
    { value: "marketing-inc", label: "Marketing Inc" },
    { value: "startup-xyz", label: "Startup XYZ" }
  ];

  const roles = [
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "ceo", label: "CEO" }
  ];

  const skills = [
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "nodejs", label: "Node.js" },
    { value: "python", label: "Python" },
    { value: "design", label: "UI/UX Design" },
    { value: "management", label: "Project Management" }
  ];

  const statusOptions = [
    { value: "active", label: "Aktywny" },
    { value: "inactive", label: "Nieaktywny" },
    { value: "pending", label: "Oczekujący" }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = getFormData(e.currentTarget);
    setFormDataState(data);
    console.log('Form Data:', data);
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    resetForm(e.currentTarget);
    setFormDataState({});
    // Reset kontrolowanych state'ów
    setSearchValue("");
    setSelectedCompanies([]);
    setSelectedRole("");
    setSelectedSkills([]);
    setSelectedStatus("");
  };

  const loadSampleData = (formRef: HTMLFormElement | null) => {
    if (!formRef) return;
    
    const sampleData = {
      search: "Jan Kowalski",
      email: "jan@example.com",
      companies: ["tech-corp", "startup-xyz"],
      role: "developer",
      skills: ["react", "typescript", "nodejs"],
      status: "active",
      bio: "Doświadczony developer z 5-letnim stażem w branży IT."
    };
    
    setFormData(formRef, sampleData);
    
    // Aktualizacja kontrolowanych state'ów
    setSearchValue(sampleData.search);
    setSelectedCompanies(sampleData.companies);
    setSelectedRole(sampleData.role);
    setSelectedSkills(sampleData.skills);
    setSelectedStatus(sampleData.status);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Formularz z klasycznymi elementami HTML
          </h1>
          <p className="text-slate-600">
            Demo pokazujące jak używać useSimpleForm z klasycznymi elementami formularza
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Formularz */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Formularz użytkownika</h2>
            
            <form 
              onSubmit={handleSubmit} 
              onReset={handleReset}
              className="space-y-4"
              ref={(ref) => {
                if (ref) {
                  // Dodajemy button do ładowania przykładowych danych
                  const loadButton = ref.querySelector('[data-load-sample]') as HTMLButtonElement;
                  if (loadButton) {
                    loadButton.onclick = () => loadSampleData(ref);
                  }
                }
              }}
            >
              
              {/* Wyszukiwanie */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Wyszukaj użytkownika
                </label>
                <SearchFilter
                  name="search"
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Imię, nazwisko..."
                />
              </div>

              {/* Email - zwykły input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              {/* Telefon - zwykły input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+48 123 456 789"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              {/* Firmy - multiple select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  Firmy (multiple select)
                </label>
                <SelectFilter
                  name="companies"
                  options={companies}
                  value={selectedCompanies}
                  onChange={setSelectedCompanies}
                  multiple
                />
              </div>

              {/* Stanowisko - single select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stanowisko
                </label>
                <SelectFilter
                  name="role"
                  options={roles}
                  value={selectedRole}
                  onChange={setSelectedRole}
                  placeholder="Wybierz stanowisko..."
                />
              </div>

              {/* Umiejętności - checkboxy */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Umiejętności
                </label>
                <CheckboxGroup
                  name="skills"
                  options={skills}
                  value={selectedSkills}
                  onChange={setSelectedSkills}
                  layout="grid"
                />
              </div>

              {/* Status - radio buttons */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <RadioGroup
                  name="status"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  layout="horizontal"
                />
              </div>

              {/* Bio - textarea */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Biografia
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Krótki opis..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-vertical"
                />
              </div>

              {/* Przyciski */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <Save className="w-4 h-4" />
                  Zapisz dane
                </button>
                <button
                  type="reset"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <RotateCcw className="w-4 h-4" />
                  Wyczyść
                </button>
                <button
                  type="button"
                  data-load-sample
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Załaduj przykład
                </button>
              </div>
            </form>
          </div>

          {/* Wyniki */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Dane z formularza</h2>
            
            {Object.keys(formData).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Wypełnij formularz aby zobaczyć dane</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <div className="text-sm font-medium text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </div>
                    <div className="text-sm text-slate-900 mt-1">
                      {Array.isArray(value) ? (
                        value.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {value.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 text-xs bg-slate-100 text-slate-800 rounded"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Brak wybranych opcji</span>
                        )
                      ) : value ? (
                        <span>{value}</span>
                      ) : (
                        <span className="text-slate-400 italic">Brak danych</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {Object.keys(formData).length > 0 && (
              <div className="mt-6 p-4 bg-slate-50 rounded-md">
                <h3 className="text-sm font-medium text-slate-700 mb-2">JSON Output:</h3>
                <pre className="text-xs text-slate-600 whitespace-pre-wrap break-words">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Instrukcje */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Jak to działa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Obsługiwane elementy HTML:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <code className="bg-slate-100 px-1 rounded">input[name]</code> - text, email, tel, password, etc.</li>
                <li>• <code className="bg-slate-100 px-1 rounded">select[name]</code> - single i multiple</li>
                <li>• <code className="bg-slate-100 px-1 rounded">textarea[name]</code> - wieloliniowy tekst</li>
                <li>• <code className="bg-slate-100 px-1 rounded">input[type="checkbox"][name]</code> - wielokrotny wybór</li>
                <li>• <code className="bg-slate-100 px-1 rounded">input[type="radio"][name]</code> - pojedynczy wybór</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Dostępne metody:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <code className="bg-slate-100 px-1 rounded">getFormData(form)</code> - pobiera dane z formularza</li>
                <li>• <code className="bg-slate-100 px-1 rounded">resetForm(form)</code> - resetuje formularz</li>
                <li>• <code className="bg-slate-100 px-1 rounded">setFormData(form, data)</code> - ustawia dane w formularzu</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-1">💡 Wskazówka</h4>
            <p className="text-sm text-blue-800">
              Wszystkie elementy formularza muszą mieć atrybut <code className="bg-blue-100 px-1 rounded">name</code> 
              żeby hook mógł je poprawnie obsłużyć. Komponenty zachowują swój UX, ale używają klasycznych elementów HTML.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}