import { useQuery } from "@tanstack/react-query";

export const OperatorContacts = () => {
  const { data } = useQuery({
    resource: "operator_contacts",
    metaData: { select: "*, users!beneficiary_id(name, email)" },
  });
  console.log("Operator contacts:", data);
  return (
    <div className="hero">
      <h1 className="text-5xl">Kontakty Beneficjentów</h1>
    </div>
  );
};
