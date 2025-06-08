// src/hooks/useSimpleForm.tsx
export const useSimpleForm = () => {
    const getFormData = (form) => {
        const data = {};
        // Obsługa input[name]
        const inputs = form.querySelectorAll('input[name]');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                // Dla checkboxów zbieramy wszystkie zaznaczone wartości w tablicę
                if (!data[input.name]) {
                    data[input.name] = [];
                }
                if (input.checked) {
                    data[input.name].push(input.value);
                }
            }
            else if (input.type === 'radio') {
                // Dla radio buttons bierzemy tylko zaznaczoną wartość
                if (input.checked) {
                    data[input.name] = input.value;
                }
            }
            else {
                // Dla zwykłych inputów
                data[input.name] = input.value;
            }
        });
        // Obsługa select[name]
        const selects = form.querySelectorAll('select[name]');
        selects.forEach(select => {
            if (select.multiple) {
                // Dla select multiple zbieramy wszystkie wybrane opcje
                const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
                data[select.name] = selectedOptions;
            }
            else {
                // Dla zwykłego select
                data[select.name] = select.value;
            }
        });
        // Obsługa textarea[name]
        const textareas = form.querySelectorAll('textarea[name]');
        textareas.forEach(textarea => {
            data[textarea.name] = textarea.value;
        });
        return data;
    };
    const resetForm = (form) => {
        form.reset();
    };
    const setFormData = (form, data) => {
        Object.entries(data).forEach(([name, value]) => {
            const elements = form.querySelectorAll(`[name="${name}"]`);
            elements.forEach(element => {
                if (element instanceof HTMLInputElement) {
                    if (element.type === 'checkbox') {
                        element.checked = Array.isArray(value) ? value.includes(element.value) : value === element.value;
                    }
                    else if (element.type === 'radio') {
                        element.checked = element.value === value;
                    }
                    else {
                        element.value = Array.isArray(value) ? value.join(', ') : value;
                    }
                }
                else if (element instanceof HTMLSelectElement) {
                    if (element.multiple && Array.isArray(value)) {
                        Array.from(element.options).forEach(option => {
                            option.selected = value.includes(option.value);
                        });
                    }
                    else {
                        element.value = Array.isArray(value) ? value[0] || '' : value;
                    }
                }
                else if (element instanceof HTMLTextAreaElement) {
                    element.value = Array.isArray(value) ? value.join('\n') : value;
                }
            });
        });
    };
    return { getFormData, resetForm, setFormData };
};
