import { useQuery } from "@tanstack/react-query";


export const OperatorContact = () => {


  const { mutate } = useCreate();
  return (
    <div className="hero">
      <h1 className="text-5xl">Kontakt z Operatorem</h1>
      <button
        className="btn btn-primary"
        onClick={() => mutate({ resource: "operator_contacts", values: {} })}
      >
        Wyślij
      </button>
    </div>
  );
};
function useCreate(): { mutate: any; } {
  throw new Error("Function not implemented.");
}

