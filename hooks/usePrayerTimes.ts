import { useState, useEffect } from 'react';

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface DhikrWindows {
  morning: { start: string; end: string };
  evening: { start: string; end: string };
}

export const usePrayerTimes = () => {
  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [dhikrWindows, setDhikrWindows] = useState<DhikrWindows | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = () => {
    setLoading(true);
    setError(null);

    // Try to get from localStorage first to save API calls
    const cached = localStorage.getItem('prayerTimesCache');
    if (cached) {
       try {
           const { date, data, windows } = JSON.parse(cached);
           // Check if cache is for today
           if (date === new Date().toISOString().slice(0, 10)) {
               setTimings(data);
               setDhikrWindows(windows);
               setLoading(false);
               return;
           }
       } catch (e) {
           // Invalid cache, ignore
       }
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Method 5 (Egyptian General Authority of Survey) as per user request
        const API_URL = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

          const response = await fetch(API_URL, { signal: controller.signal });
          clearTimeout(timeoutId);

          const data = await response.json();
          
          if (data.code === 200) {
            const fetchedTimings = data.data.timings;
            setTimings(fetchedTimings);
            
            const windows = {
                morning: { start: fetchedTimings.Fajr, end: fetchedTimings.Dhuhr },
                evening: { start: fetchedTimings.Asr, end: fetchedTimings.Maghrib }
            };
            setDhikrWindows(windows);
            
            // Cache
            localStorage.setItem('prayerTimesCache', JSON.stringify({
                date: new Date().toISOString().slice(0, 10),
                data: fetchedTimings,
                windows: windows
            }));
          } else {
             setError("API Error");
          }
        } catch (err) {
          setError("Network Error");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location Permission Denied");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  return { timings, dhikrWindows, loading, error, retry: fetchPrayerTimes };
};
