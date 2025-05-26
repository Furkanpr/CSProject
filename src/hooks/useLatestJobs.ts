import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  workPreference?: string;
  sector?: string;
  position?: string;
  experienceLevel?: string;
}

export const useLatestJobs = (limitCount: number = 5) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Basit query - sadece createdAt ile sıralama (index gerektirmez)
    const jobsQuery = query(
      collection(db, 'jobs'),
      orderBy('createdAt', 'desc'),
      limit(20) // Daha fazla alıp client-side filtreleyelim
    );

    // Set up real-time listener
    const unsubscribeJobs = onSnapshot(
      jobsQuery,
      (snapshot) => {
        console.log('Jobs snapshot received, count:', snapshot.docs.length);
        const allJobs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Job[];
        
        // Client-side filtering - sadece approved olanları al
        const approvedJobs = allJobs
          .filter(job => job.status === 'approved')
          .slice(0, limitCount);
        
        console.log('Approved jobs count:', approvedJobs.length);
        setJobs(approvedJobs);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching latest jobs:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribeJobs();
  }, [limitCount]);

  return { jobs, loading, error };
}; 