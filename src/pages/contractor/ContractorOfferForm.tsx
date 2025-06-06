import { useCreate } from "@pankod/refine-core";

export const ContractorOfferForm = () => {
  const { mutate } = useCreate();
  return (
    <div className="hero">
      <h1 className="text-5xl">Nowa Oferta</h1>
      <button
        className="btn btn-primary"
        onClick={() => mutate({ resource: "contractor_offers", values: {} })}
      >
        Wyślij
      </button>
    </div>
  );
};
