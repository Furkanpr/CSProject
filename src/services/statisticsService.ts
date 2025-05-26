import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Statistics {
  openPositions: number;
  companies: number;
  jobSeekers: number;
  satisfactionRate: number;
}

export interface CategoryCount {
  name: string;
  icon: string;
  count: number;
}

export const getStatistics = async (): Promise<Statistics> => {
  try {
    // Aktif iş ilanlarını say
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('status', '==', 'approved')
    );
    const jobsSnap = await getDocs(jobsQuery);
    const openPositions = jobsSnap.size;

    // Aktif şirketleri say (employerları say)
    const companiesQuery = query(
      collection(db, 'users'),
      where('userType', '==', 'employer')
    );
    const companiesSnap = await getDocs(companiesQuery);
    const companies = companiesSnap.size;

    // İş arayanları say
    const jobSeekersQuery = query(
      collection(db, 'users'),
      where('userType', '==', 'jobseeker')
    );
    const jobSeekersSnap = await getDocs(jobSeekersQuery);
    const jobSeekers = jobSeekersSnap.size;

    return {
      openPositions,
      companies,
      jobSeekers,
      satisfactionRate: 90 // Sabit değer olarak 90
    };
  } catch (error) {
    console.error('İstatistikler alınırken hata:', error);
    return {
      openPositions: 0,
      companies: 0,
      jobSeekers: 0,
      satisfactionRate: 90
    };
  }
};

export const getCategoryStatistics = async (): Promise<CategoryCount[]> => {
  try {
    const categories = [
      { name: 'Yazılım Geliştirme', icon: '💻', query: 'software' },
      { name: 'Pazarlama', icon: '📊', query: 'marketing' },
      { name: 'Tasarım', icon: '🎨', query: 'design' },
      { name: 'Müşteri Hizmetleri', icon: '🤝', query: 'customer-service' },
      { name: 'Finans', icon: '💰', query: 'finance' },
      { name: 'İnsan Kaynakları', icon: '👥', query: 'hr' }
    ];

    const results = await Promise.all(
      categories.map(async category => {
        try {
          const jobsQuery = query(
            collection(db, 'jobs'),
            where('category', '==', category.query),
            where('status', '==', 'approved')
          );
          const snapshot = await getDocs(jobsQuery);
          
          return {
            name: category.name,
            icon: category.icon,
            count: snapshot.size
          };
        } catch (error) {
          console.error(`${category.name} için istatistik alınırken hata:`, error);
          return {
            name: category.name,
            icon: category.icon,
            count: 0
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Kategori istatistikleri alınırken hata:', error);
    return [];
  }
}; 