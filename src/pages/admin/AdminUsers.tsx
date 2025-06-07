import { supabase } from "@/utility";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const AdminUsers = () => {
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_number: string;
    city: string;
    user_points: { balance: number }[];
    created_at: string;
  }

  const [page, setPage] = useState(0);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", page, roleFilter, searchTerm],
    queryFn: async () => {
      let query = supabase.from("users").select(
        `
          *,
          user_points(balance)
        `,
        { count: "exact" }
      );

      // Filtrowanie po roli
      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      // Wyszukiwanie po nazwie lub emailu
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      // Paginacja
      const from = page * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { users: data, totalCount: count };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const users = data?.users || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="hero">
        <h1 className="text-5xl">Zarządzanie Użytkownikami</h1>
        <div className="loading">Ładowanie użytkowników...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero">
        <h1 className="text-5xl">Zarządzanie Użytkownikami</h1>
        <div className="error">
          Błąd podczas ładowania: {error.message}
          <button onClick={() => refetch()} className="btn-retry">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hero">
      <h1 className="text-5xl">Zarządzanie Użytkownikami</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Szukaj po nazwie lub emailu..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // Reset do pierwszej strony
          }}
          className="search-input"
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(0); // Reset do pierwszej strony
          }}
          className="role-filter"
        >
          <option value="">Wszystkie role</option>
          <option value="admin">Admin</option>
          <option value="user">Użytkownik</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>

      <div className="users-stats">
        <p>
          Wyświetlono {users.length} z {totalCount} użytkowników
        </p>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Telefon</th>
              <th>Miasto</th>
              <th>Punkty</th>
              <th>Data utworzenia</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.phone_number}</td>
                <td>{user.city}</td>
                <td>{user.user_points?.[0]?.balance || 0}</td>
                <td>{new Date(user.created_at).toLocaleDateString("pl-PL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="pagination-btn"
        >
          Poprzednia
        </button>

        <span className="page-info">
          Strona {page + 1} z {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="pagination-btn"
        >
          Następna
        </button>
      </div>
    </div>
  );
};
