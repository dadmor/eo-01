// src/hooks/useSimpleForm.tsx
export const useSimpleForm = () => {
  const getFormData = (form: HTMLFormElement) => {
    const data: Record<string, string> = {};
    const inputs = form.querySelectorAll('input[name]') as NodeListOf<HTMLInputElement>;
    
    inputs.forEach(input => {
      data[input.name] = input.value;
    });
    
    return data;
  };

  return { getFormData };
};