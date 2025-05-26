import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hakkımızda Bölümü */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <p className="text-blue-200 text-sm mb-4">
              İş arayanlar ve işverenler için en iyi eşleşmeyi sağlayan dijital kariyer platformu. 
              Amacımız iş arayanları hayallerindeki işle, işverenleri ise en iyi yeteneklerle buluşturmak.
            </p>
            <p className="text-blue-200 text-sm">
              Modern teknolojiler ve kullanıcı dostu arayüzümüzle iş arama ve işe alım süreçlerini 
              kolaylaştırıyor, her iki taraf için de değer yaratıyoruz.
            </p>
          </div>

          {/* İletişim Bilgileri */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-200 text-sm">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                csisbulma@gmail.com
              </li>
              <li className="flex items-center text-blue-200 text-sm">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0850 123 45 67
              </li>
              <li className="flex items-center text-blue-200 text-sm">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                İstanbul, Türkiye
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-6 pt-6 border-t border-blue-800">
          <div className="flex justify-center pb-4">
            <p className="text-blue-200 text-sm">
              © {new Date().getFullYear()} Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 