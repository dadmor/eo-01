import { useCreate, useQuery } from "@pankod/refine-core";

export const AuditorPortfolio = () => {
  const { data } = useQuery({ querykey: [ "auditor_portfolios" });
  const { mutate } = useCreate();
  console.log('Auditor portfolio:', data);
  return <div className="hero"><h1 className="text-5xl">Portfolio Audytora</h1><button className="btn btn-primary" onClick={() => mutate({ querykey: [ "auditor_portfolios", values: {} })}>Zapisz</button></div>;
};