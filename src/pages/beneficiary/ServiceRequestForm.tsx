import { useCreate } from "@pankod/refine-core";

export const ServiceRequestForm = () => {
  const { mutate } = useCreate();
  return (
    <div className="hero">
      <h1 className="text-5xl">Zlecenie Wykonawcy</h1>
      <button
        className="btn btn-primary"
        onClick={() => mutate({ resource: "service_requests", values: {} })}
      >
        Utwórz
      </button>
    </div>
  );
};
