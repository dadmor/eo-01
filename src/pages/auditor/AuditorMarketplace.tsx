import { useList } from "@pankod/refine-core";

export const AuditorMarketplace = () => {
  const { data } = useList({ resource: "audit_requests", metaData: { select: "*, users!beneficiary_id(name, postal_code)" } });
  console.log('Audit marketplace:', data);
  return <div className="hero"><h1 className="text-5xl">Giełda Audytorów</h1></div>;
};
