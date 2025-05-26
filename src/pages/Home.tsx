import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLatestJobs } from '../hooks/useLatestJobs';
import { getNameById } from '../services/jobConstants';
import { JOB_TYPES, WORK_PREFERENCES, EXPERIENCE_LEVELS, SECTORS } from '../services/jobConstants';
import { getStatistics, getCategoryStatistics, Statistics, CategoryCount } from '../services/statisticsService';

const Home: React.FC = () => {
  const { user, userType, devModeLogin } = useAuth();
  const navigate = useNavigate();
  const [showDevSection, setShowDevSection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { jobs: featuredJobs, loading: jobsLoading, error: jobsError } = useLatestJobs(5);
  
  // İstatistikler için state
  const [statistics, setStatistics] = useState<Statistics>({
    openPositions: 0,
    companies: 0,
    jobSeekers: 0,
    satisfactionRate: 0
  });
  const [popularCategories, setPopularCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // İş arayan/kariyer görselleri
  const heroImages = [
 
    { 
      url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
      alt: "Toplantıda çalışan profesyoneller"
    },
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
      alt: "Bilgisayarda çalışan ekip"
    },
    {
      url: "https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=1000&q=80", 
      alt: "İş görüşmesi yapan kişiler"
    },
  ];

  // Otomatik görsel geçişi için
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Her 5 saniyede bir görsel değişimi
    
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Manuel görsel değiştirme
  const changeImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Geliştirici modu girişi için fonksiyon
  const handleDevLogin = (type: 'admin' | 'employer' | 'jobseeker') => {
    devModeLogin(type);
    
    // Kullanıcı tipine göre yönlendirme yap
    if (type === 'admin') {
      navigate('/admin/dashboard');
    } else if (type === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/jobs');
    }
  };

  // Gizli geliştirici bölümünü aç/kapat
  const toggleDevSection = () => {
    setShowDevSection(!showDevSection);
  };

  // İstatistikleri yükle
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const [stats, categories] = await Promise.all([
          getStatistics(),
          getCategoryStatistics()
        ]);
        setStatistics(stats);
        setPopularCategories(categories);
        setError(null);
      } catch (err) {
        setError('İstatistikler yüklenirken bir hata oluştu.');
        console.error('İstatistik yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Bölümü */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Kariyerinde <span className="text-yellow-300">İleri Adım</span> Atma Zamanı
              </h1>
              <p className="text-lg md:text-xl max-w-2xl text-blue-100">
                Binlerce iş ilanı arasından hayalindeki işi bul. İş Bul platformunda kariyerini şekillendir.
              </p>
              
              {/* Arama Kutusu */}
              <div className="bg-white rounded-lg p-1 flex shadow-lg">
                <input
                  type="text"
                  placeholder="İş unvanı, pozisyon veya anahtar kelime"
                  className="flex-grow px-4 py-3 text-gray-900 focus:outline-none rounded-l-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (searchTerm.trim()) {
                      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
                    } else {
                      navigate('/jobs');
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-blue-700 transition duration-200"
                >
                  Ara
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-blue-100 font-medium">Popüler aramalar:</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      setSearchTerm('Yazılım');
                      navigate(`/jobs?search=${encodeURIComponent('Yazılım')}`);
                    }} 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                  >
                    <span className="mr-2">💻</span>
                    Yazılım
                  </button>
                  <button 
                    onClick={() => {
                      setSearchTerm('Pazarlama');
                      navigate(`/jobs?search=${encodeURIComponent('Pazarlama')}`);
                    }} 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                  >
                    <span className="mr-2">📊</span>
                    Pazarlama
                  </button>
                  <button 
                    onClick={() => {
                      setSearchTerm('Uzaktan');
                      navigate(`/jobs?search=${encodeURIComponent('Uzaktan')}`);
                    }} 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                  >
                    <span className="mr-2">🏠</span>
                    Uzaktan
                  </button>
                  <button 
                    onClick={() => {
                      setSearchTerm('Part-time');
                      navigate(`/jobs?search=${encodeURIComponent('Part-time')}`);
                    }} 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                  >
                    <span className="mr-2">⌛</span>
                    Part-time
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              {/* Görsel gösterici */}
              <div className="relative overflow-hidden rounded-lg shadow-xl h-[400px]">
                {heroImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image.url} 
                    alt={image.alt}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                
                {/* Görsel geçiş noktaları */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changeImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                      aria-label={`Görsel ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* İstatistikler */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{statistics.openPositions}+</p>
                <p className="text-gray-500">Açık Pozisyon</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{statistics.companies}+</p>
                <p className="text-gray-500">Şirket</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{statistics.jobSeekers}+</p>
                <p className="text-gray-500">İş Arayan</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">%{statistics.satisfactionRate}</p>
                <p className="text-gray-500">Memnuniyet Oranı</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Kategoriler */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popüler Kategoriler</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">Tümünü Gör →</Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow p-6 text-center"
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Öne Çıkan İlanlar */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Öne Çıkan İlanlar</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">Tüm İlanlar →</Link>
          </div>
          
          {jobsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : jobsError ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
              İlanlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz İlan Bulunmuyor</h3>
              <p className="text-gray-500">Yakında yeni ilanlar eklenecek.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map(job => (
                <Link 
                  key={job.id} 
                  to={`/jobs/${job.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col h-full"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="text-4xl bg-gray-100 p-3 rounded-lg mb-4">
                        {job.sector ? getNameById(SECTORS, job.sector).charAt(0) : '🏢'}
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Yeni</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <p className="text-gray-600 text-sm mb-4">{job.location}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {getNameById(JOB_TYPES, job.type)}
                      </span>
                      {job.workPreference && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {getNameById(WORK_PREFERENCES, job.workPreference)}
                        </span>
                      )}
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-right">
                    <span className="text-blue-600 font-medium">Detayları Gör →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        {/* Kullanıcı İşlemleri */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kariyerinde İlerlemek İçin Hemen Başla</h2>
              <p className="text-gray-600 max-w-xl">İster iş arıyor olun, ister işe alım yapın, İş Bul platformu profesyonel ihtiyaçlarınız için burada.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!user ? (
                <>
                  <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center">Üye Ol</Link>
                  <Link to="/login" className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-gray-50 transition text-center">Giriş Yap</Link>
                </>
              ) : (
                <Link 
                  to={userType === 'employer' ? '/employer/dashboard' : userType === 'admin' ? '/admin' : '/jobs'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  {userType === 'employer' ? 'İlanlarımı Yönet' : userType === 'admin' ? 'Admin Paneli' : 'İş İlanlarını Görüntüle'}
                </Link>
              )}
            </div>
          </div>
        </section>
        
        {/* Nasıl Çalışır */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Nasıl Çalışır?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Profil Oluştur</h3>
              <p className="text-gray-600">CV'ni yükle, becerilerini ve tercihlerini belirle, iş arama sürecine başla.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">İlan Ara ve Başvur</h3>
              <p className="text-gray-600">Arama filtreleriyle sana uygun ilanları bul ve hızlıca başvurunu yap.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Görüşmeye Katıl</h3>
              <p className="text-gray-600">Başvuruların onaylandığında işverenle iletişime geç ve kariyer yolculuğuna başla.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Geliştirici Modu - sayfa altında gizli buton */}
      <div className="text-center pb-4">
        <button 
          onClick={toggleDevSection}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {showDevSection ? "Geliştirici Modunu Gizle" : "Geliştirici Modu"}
        </button>
        
        {showDevSection && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-lg mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geliştirici Modu - Hızlı Giriş</h3>
            <div className="flex flex-row justify-center gap-2">
              <button
                onClick={() => handleDevLogin('admin')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Admin Girişi
              </button>
              <button
                onClick={() => handleDevLogin('employer')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                İşveren Girişi
              </button>
              <button
                onClick={() => handleDevLogin('jobseeker')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                İş Arayan Girişi
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Bu giriş yöntemi sadece geliştirme ortamında çalışır ve gerçek kimlik doğrulamayı atlayarak test amaçlı kullanılır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 