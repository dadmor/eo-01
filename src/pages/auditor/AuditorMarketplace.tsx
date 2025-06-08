import { useQuery } from "@pankod/refine-core";

export const AuditorMarketplace = () => {
  const { data } = useQuery({ querykey: [ "audit_requests", metaData: { select: "*, users!beneficiary_id(name, postal_code)" } });
  console.log('Audit marketplace:', data);
  return <div className="hero"><h1 className="text-5xl">Giełda Audytorów</h1></div>;
};
