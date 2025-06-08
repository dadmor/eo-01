import { useCreate, useQuery } from "@pankod/refine-core";

export const ContractorPortfolio = () => {
  const { data } = useQuery({ querykey: [ "contractor_portfolios", metaData: { select: "*, contractor_gallery(*)" } });
  const { mutate } = useCreate();
  console.log('Portfolio:', data);
  return <div className="hero"><h1 className="text-5xl">Portfolio Wykonawcy</h1><button className="btn btn-primary" onClick={() => mutate({ querykey: [ "contractor_portfolios", values: {} })}>Zapisz</button></div>;
};