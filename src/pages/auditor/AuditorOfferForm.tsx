import { useCreate } from "@pankod/refine-core";

export const AuditorOfferForm = () => {
    const { mutate } = useCreate();
    return <div className="hero"><h1 className="text-5xl">Nowa Oferta Audytu</h1><button className="btn btn-primary" onClick={() => mutate({ resource: "auditor_offers", values: {} })}>Wyślij</button></div>;
  };