import { useLiveQuery } from 'dexie-react-hooks';
import { db, searchDrugs, seedDatabase } from '../db/database';
import type { Drug } from '../types';
import { useEffect, useState } from 'react';

// Hook for all drugs
export function useAllDrugs() {
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => setIsSeeded(true));
  }, []);

  const drugs = useLiveQuery(
    () => (isSeeded ? db.drugs.toArray() : []),
    [isSeeded]
  );

  return {
    drugs: drugs ?? [],
    isLoading: !isSeeded || drugs === undefined,
  };
}

// Hook for drug search
export function useDrugSearch(query: string) {
  const [results, setResults] = useState<Drug[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchDrugs(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, isSearching };
}

// Hook for single drug
export function useDrug(id: string | null) {
  const drug = useLiveQuery(
    () => (id ? db.drugs.get(id) : undefined),
    [id]
  );

  return {
    drug,
    isLoading: id !== null && drug === undefined,
  };
}

// Hook for all alerts
export function useAllAlerts() {
  const alerts = useLiveQuery(() => db.alerts.toArray());

  return {
    alerts: alerts ?? [],
    isLoading: alerts === undefined,
  };
}
