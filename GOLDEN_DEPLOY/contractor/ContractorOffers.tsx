import { useQuery } from "@pankod/refine-core";

export const ContractorOffers = () => {
  const { data } = useQuery({
    resource: "contractor_offers",
    metaData: { select: "*, service_requests(postal_code, city)" },
  });
  console.log("Offers:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Moje Oferty</h1>
    </div>
  );
};
