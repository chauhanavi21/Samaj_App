import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Periodic data refresh hook (ALTERNATIVE to cron jobs)
 * Refreshes data at intervals when app is in foreground
 * Automatically pauses when app is backgrounded
 */

interface UsePeriodicRefreshOptions {
  intervalMs?: number; // Default: 5 minutes
  onRefresh: () => void | Promise<void>;
  refreshOnFocus?: boolean; // Refresh when app comes to foreground
}

export function usePeriodicRefresh({
  intervalMs = 5 * 60 * 1000, // 5 minutes default
  onRefresh,
  refreshOnFocus = true
}: UsePeriodicRefreshOptions) {
  
  // Periodic refresh when app is active
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Periodic refresh triggered');
      onRefresh();
    }, intervalMs);

    // Initial refresh
    onRefresh();

    return () => clearInterval(interval);
  }, [intervalMs, onRefresh]);

  // Refresh when app comes to foreground
  useEffect(() => {
    if (!refreshOnFocus) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('🔄 App focused - refreshing data');
        onRefresh();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [refreshOnFocus, onRefresh]);
}

/**
 * Example usage:
 * 
 * function EventsScreen() {
 *   const [events, setEvents] = useState([]);
 *   
 *   const fetchEvents = useCallback(async () => {
 *     const response = await api.get('/content/upcoming-events');
 *     setEvents(response.data);
 *   }, []);
 *   
 *   // Refresh every 5 minutes + when app comes to foreground
 *   usePeriodicRefresh({
 *     intervalMs: 5 * 60 * 1000,
 *     onRefresh: fetchEvents
 *   });
 *   
 *   return <EventsList events={events} />;
 * }
 */
