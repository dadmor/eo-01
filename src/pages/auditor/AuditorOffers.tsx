import { useList } from "@pankod/refine-core";

export const AuditorOffers = () => {
  const { data } = useList({ resource: "auditor_offers", metaData: { select: "*, audit_requests(postal_code, city)" } });
  console.log('Auditor offers:', data);
  return <div className="hero"><h1 className="text-5xl">Moje Oferty Audytu</h1></div>;
};