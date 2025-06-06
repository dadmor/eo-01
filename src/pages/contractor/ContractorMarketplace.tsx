import { useList } from "@pankod/refine-core";

export const ContractorMarketplace = () => {
  const { data } = useList({
    resource: "service_requests",
    metaData: { select: "*, users!beneficiary_id(name, postal_code)" },
  });
  console.log("Marketplace:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Giełda Wykonawców</h1>
    </div>
  );
};
