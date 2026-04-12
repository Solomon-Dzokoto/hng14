import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://open.er-api.com/v6/latest/USD';

export interface CurrencyData {
  rates: Record<string, number>;
  time_last_update_utc: string;
}

const fetchRates = async (): Promise<CurrencyData> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch rates');
  return res.json();
};

export const useCurrencyRates = () =>
  useQuery({
    queryKey: ['currencyRates'],
    queryFn: fetchRates,
    staleTime: 60 * 60 * 1000,       // 1 hour
    gcTime: 24 * 60 * 60 * 1000,     // 24 hours
    retry: 2,
  });
