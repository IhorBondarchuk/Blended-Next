'use client';

import { useEffect } from 'react';

import { getUserInfo } from '@/lib/service/opencagedataApi';
import { useCurrenceStore } from '@/lib/stores/currencyStore';

export default function GeolocationChecker() {
  const baseCurrency = useCurrenceStore((state) => state.baseCurrency);
  const setBaseCurrency = useCurrenceStore((state) => state.setBaseCurrency);
  const hasHydrated = useCurrenceStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || baseCurrency) return;
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = async ({ coords }: GeolocationPosition) => {
      const data = await getUserInfo(coords);
      return data.results[0].annotations.currency.iso_code;
    };

    const error = () => {
      setBaseCurrency('USD');
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, [hasHydrated, baseCurrency, setBaseCurrency]);

  return null;
}
