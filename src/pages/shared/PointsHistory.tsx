// src/components/PointsHistory.jsx

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utility";
interface Transaction {
  id: number;
  user_id: number;
  balance: number;
  updated_at: string;
}

export const PointsHistory = () => {
  const {
    data: transactions = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["points_transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("points_transactions")
        .select("*");
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 60_000, 
    retry: false,     
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>Błąd: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-5xl mb-6">Historia Punktów</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Balance</th>
              <th>Data Aktualizacji</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: Transaction) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.user_id}</td>
                <td>{tx.balance}</td>
                <td>
                  {new Date(tx.updated_at).toLocaleString("pl-PL", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
