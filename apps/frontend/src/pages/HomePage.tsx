import { useQuery } from '@tanstack/react-query';

interface HealthResponse {
  status: string;
}

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json() as Promise<HealthResponse>;
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  const backendStatus = isLoading ? 'checking…' : isError ? 'unreachable' : data?.status;

  return (
    <main>
      <h1>e-shop</h1>
      <p>Frontend scaffold is running.</p>
      <p>Backend status: {backendStatus}</p>
    </main>
  );
}
