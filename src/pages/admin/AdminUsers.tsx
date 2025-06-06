import { useList } from "@pankod/refine-core";

export const AdminUsers = () => {
  const { data } = useList({ resource: "users", metaData: { select: "*, user_points(balance)" } });
  console.log('All users:', data);
  return <div className="hero"><h1 className="text-5xl">Zarządzanie Użytkownikami</h1></div>;
};