import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

/**
 * Real-time listener for Firestore data
 * Automatically updates when data changes in Firebase
 * No need for cron jobs or polling!
 */

// Listen to upcoming events in real-time
export function useUpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(firestore, 'upcomingEvents'),
      orderBy('date', 'asc'),
      limit(10)
    );

    // Real-time listener - updates automatically when data changes!
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to events:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  return { events, loading, error };
}

// Listen to special offers in real-time
export function useSpecialOffers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(firestore, 'specialOffers'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOffers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { offers, loading };
}

// Listen to spiritual places in real-time
export function useSpiritualPlaces() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'spiritualPlaces'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlaces(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { places, loading };
}

// Listen to committee members in real-time
export function useCommitteeMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(firestore, 'committeeMembers'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { members, loading };
}

// Generic real-time listener for any collection
export function useRealtimeCollection(collectionName: string, orderByField?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = collection(firestore, collectionName);
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, 'desc')) as any;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { data, loading, error };
}
