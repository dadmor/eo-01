import { useCreate } from "@pankod/refine-core";

export const AuditRequestForm = () => {
  const { mutate } = useCreate();
  return (
    <div className="hero">
      <h1 className="text-5xl">Zlecenie Audytora</h1>
      <button
        className="btn btn-primary"
        onClick={() => mutate({ resource: "audit_requests", values: {} })}
      >
        Utwórz
      </button>
    </div>
  );
};
