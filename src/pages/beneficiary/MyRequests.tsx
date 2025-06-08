import { useQuery } from "@pankod/refine-core";

export const MyRequests = () => {
  const { data } = useQuery({
    resource: "service_requests",
    metaData: { select: "*, contractor_offers(*, users!contractor_id(*))" },
  });
  console.log("My requests:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Moje Zlecenia</h1>
    </div>
  );
};
