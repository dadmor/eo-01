import { useQuery } from "@tanstack/react-query";

export const OperatorRequests = () => {
  const { data } = useQuery({
    resource: "service_requests",
    metaData: {
      select: "*, users!beneficiary_id(name, email), contractor_offers(count)",
    },
  });
  console.log("Operator requests:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Zapytania do Weryfikacji</h1>
    </div>
  );
};
