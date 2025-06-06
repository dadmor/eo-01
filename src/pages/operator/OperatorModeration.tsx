import { useList } from "@pankod/refine-core";

export const OperatorModeration = () => {
  const { data } = useList({
    resource: "moderation_logs",
    metaData: { select: "*, users!operator_id(name)" },
  });
  console.log("Moderation logs:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Panel Moderacji</h1>
    </div>
  );
};
