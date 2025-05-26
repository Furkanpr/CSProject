import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../context/StoreContext';
import { observer } from 'mobx-react-lite';
import Logo from './Logo';

const Navbar: React.FC = observer(() => {
  const { user, userType, logout } = useAuth();
  const { notificationViewModel, favoriteViewModel } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Admin kontrolü
  const isAdmin = user?.email === 'admin@sanaismikyok.com' || user?.email === 'fuurkandemiir@gmail.com';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // 2 saniye bekle ve ana sayfaya yönlendir
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate('/');
      }, 800);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Employer kullanıcıları için bildirimleri yükle
  useEffect(() => {
    if (user && userType === 'employer') {
      notificationViewModel.fetchUserNotifications(user.uid);
    }
  }, [user, userType, notificationViewModel]);

  // Loading ekranı göster
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Çıkış yapılıyor...</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Logo width={90} height={60} />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium relative group ${
                  location.pathname === '/' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="relative">
                  Ana Sayfa
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
                    location.pathname === '/'
                      ? 'bg-blue-600 scale-x-100'
                      : 'bg-blue-600 scale-x-0 group-hover:scale-x-100'
                  }`} />
                </span>
              </Link>
              
              <Link
                to="/jobs"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium relative group ${
                  location.pathname === '/jobs'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="relative">
                  İlanlar
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
                    location.pathname === '/jobs'
                      ? 'bg-blue-600 scale-x-100'
                      : 'bg-blue-600 scale-x-0 group-hover:scale-x-100'
                  }`} />
                </span>
              </Link>
              
              <Link
                to="/team"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium relative group ${
                  location.pathname === '/team'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="relative">
                  Ekibimiz
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
                    location.pathname === '/team'
                      ? 'bg-blue-600 scale-x-100'
                      : 'bg-blue-600 scale-x-0 group-hover:scale-x-100'
                  }`} />
                </span>
              </Link>
              
              <Link
                to="/visitors"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium relative group ${
                  location.pathname === '/visitors'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="relative">
                  Sizden Gelenler
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
                    location.pathname === '/visitors'
                      ? 'bg-blue-600 scale-x-100'
                      : 'bg-blue-600 scale-x-0 group-hover:scale-x-100'
                  }`} />
                </span>
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium relative group ${
                    location.pathname.startsWith('/admin')
                      ? 'text-red-600'
                      : 'text-red-500 hover:text-red-600'
                  }`}
                >
                  <span className="relative">
                    Admin Paneli
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-red-600 scale-x-100'
                        : 'bg-red-600 scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Sağ taraftaki butonlar */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {!user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors duration-200"
                >
                  Giriş Yap / Üye Ol
                  <svg
                    className={`ml-2 h-4 w-4 transform ${dropdownOpen ? 'rotate-180' : ''} transition-transform duration-200`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50 transform transition-all duration-200"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Aday (İş mi Arıyorsun?)</p>
                        <p className="text-xs text-gray-500 mb-3">Burada seni bekleyen binlerce ilan var!</p>
                        <div className="flex space-x-2">
                          <Link
                            to="/login?type=jobseeker"
                            className="flex-1 text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Aday Girişi
                          </Link>
                          <Link
                            to="/register?type=jobseeker"
                            className="flex-1 text-center bg-blue-600 text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Üye Ol
                          </Link>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">İşveren (İlan mı Vereceksiniz?)</p>
                        <p className="text-xs text-gray-500 mb-3">Pozisyonunuza en uygun aday burada!</p>
                        <div className="flex space-x-2">
                          <Link
                            to="/login?type=employer"
                            className="flex-1 text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            İşveren Girişi
                          </Link>
                          <Link
                            to="/register?type=employer"
                            className="flex-1 text-center bg-blue-600 text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Üye Ol
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {userType === 'employer' && (
                  <Link
                    to="/employer/dashboard"
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === '/employer/dashboard'
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    İlanlarım
                  </Link>
                )}
                {userType === 'jobseeker' && (
                  <>
                    <Link
                      to="/my-applications"
                      className={`text-sm font-medium ${
                        location.pathname === '/my-applications'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Başvurularım
                    </Link>
                    <Link
                      to="/profile"
                      className={`text-sm font-medium ${
                        location.pathname === '/profile'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Profilim
                    </Link>
                  </>
                )}
                {userType === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium ${
                      location.pathname === '/admin'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Yönetici Paneli
                  </Link>
                )}
                {userType === 'employer' && (
                  <Link
                    to="/notifications"
                    className="text-gray-600 hover:text-blue-600 p-1.5 rounded-lg hover:bg-gray-50 relative transition-colors duration-200"
                    title="Bildirimler"
                  >
                    <svg 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                      />
                    </svg>
                    {notificationViewModel.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
                        {notificationViewModel.unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors duration-200"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>

          {/* Mobil menü butonu */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="sr-only">Menüyü aç</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/jobs"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              İlanlar
            </Link>
            <Link
              to="/team"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Ekibimiz
            </Link>
            <Link
              to="/visitors"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Sizden Gelenler
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-red-700 hover:bg-gray-50 hover:border-red-300"
              >
                Admin Paneli
              </Link>
            )}
            {!user ? (
              <>
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Aday (İş mi Arıyorsun?)</p>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login?type=jobseeker"
                        className="text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Aday Girişi
                      </Link>
                      <Link
                        to="/register?type=jobseeker"
                        className="text-center bg-blue-600 text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Üye Ol
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">İşveren (İlan mı Vereceksiniz?)</p>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login?type=employer"
                        className="text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        İşveren Girişi
                      </Link>
                      <Link
                        to="/register?type=employer"
                        className="text-center bg-blue-600 text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Üye Ol
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {userType === 'employer' && (
                  <Link
                    to="/employer/dashboard"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  >
                    İlanlarım
                  </Link>
                )}
                {userType === 'jobseeker' && (
                  <>
                    <Link
                      to="/my-applications"
                      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    >
                      Başvurularım
                    </Link>
                    <Link
                      to="/profile"
                      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    >
                      Profilim
                    </Link>
                  </>
                )}
                {userType === 'admin' && (
                  <Link
                    to="/admin"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  >
                    Yönetici Paneli
                  </Link>
                )}
                {userType === 'employer' && (
                  <Link
                    to="/notifications"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <svg 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                        />
                      </svg>
                      Bildirimler
                    </div>
                    {notificationViewModel.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationViewModel.unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium text-red-700 hover:bg-gray-50 hover:border-gray-300"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
});

export default Navbar; 