import { useList } from "@pankod/refine-core";

export const PointsHistory = () => {
  const { data } = useList({ resource: "points_transactions" });
  console.log("Points history:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Historia Punktów</h1>
    </div>
  );
};
