// hooks/useProfile.ts
import { useSyncedData } from './useSyncedData';

export function useProfile(token: string) {
  const fetchFn = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const saveFn = async (data: any) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  };

  return useSyncedData('userProfile', fetchFn, saveFn, {});
}
