import { supabase } from '@/utility';
import { useQuery } from '@tanstack/react-query';
interface Log {
  id: number;
  action: string;
  severity: string;
  description: string;
  users: {
    name: string;
    email: string;
  };
  created_at: string;
  metadata: any; // Add this line
}

export const AdminLogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['moderation_logs'], 
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moderation_logs')
        .select('*, users!operator_id(name, email)');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  console.log('System logs:', data);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Ładowanie logów systemowych...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Błąd ładowania logów!</h3>
            <div className="text-xs">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content">Logi Systemowe</h1>
        <p className="text-base-content/70 mt-2">Historia działań w systemie</p>
      </div>
      
      {/* Stats/Summary */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Łączna liczba logów</div>
          <div className="stat-value text-primary">{data?.length || 0}</div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((log:Log) => (
            <div key={log.id} className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {log.action}
                      <div className="badge badge-primary badge-sm ml-2">
                        {log.severity || 'INFO'}
                      </div>
                    </h3>
                    
                    <p className="text-base-content/70 mt-2">{log.description}</p>
                    
                    {log.users && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span className="text-xs">{log.users.name?.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{log.users.name}</p>
                          <p className="text-xs text-base-content/50">{log.users.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {log.metadata && (
                      <div className="mt-3">
                        <details className="collapse collapse-arrow bg-base-200">
                          <summary className="collapse-title text-sm font-medium">
                            Szczegóły techniczne
                          </summary>
                          <div className="collapse-content">
                            <pre className="text-xs bg-base-300 p-2 rounded mt-2 overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-base-content">
                      {new Date(log.created_at).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="text-xs text-base-content/50">
                      {new Date(log.created_at).toLocaleTimeString('pl-PL')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="hero min-h-[200px]">
            <div className="hero-content text-center">
              <div>
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold">Brak logów</h3>
                <p className="text-base-content/70">
                  Nie znaleziono żadnych logów systemowych do wyświetlenia
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination (jeśli potrzebne) */}
      {data && data.length > 10 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn">«</button>
            <button className="join-item btn">Strona 1</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
      )}
    </div>
  );
};