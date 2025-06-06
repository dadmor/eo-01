import { useList } from "@pankod/refine-core";

export const AdminLogs = () => {
  const { data } = useList({ resource: "moderation_logs",  metaData: { select: "*, users!operator_id(name, email)" } });
  console.log('System logs:', data);
  return <div className="hero"><h1 className="text-5xl">Logi Systemowe</h1></div>;
};