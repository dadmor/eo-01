import { useCreate } from "@pankod/refine-core";

export const OperatorContact = () => {
  const { data } = useQuery({ resource: "operator_contacts" });
  console.log("Contacts:", data);
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
