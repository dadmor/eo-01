import { useList } from "@pankod/refine-core";

export const OperatorReports = () => {
  const { data } = useList({ resource: "reports" });
  console.log("Reports:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Raporty</h1>
    </div>
  );
};
