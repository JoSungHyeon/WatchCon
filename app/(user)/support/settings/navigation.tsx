'use client';

// import { getPageRoutes } from '@/app/lib/support/pageroutes';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'; // 사용하지 않으므로 주석 처리 또는 제거
import { getPageRoutes } from '@/app/lib/support/pageroutes'; // 주석 해제

// 기본 네비게이션 상수 정의
const DEFAULT_NAVIGATION = [
  {
    title: 'DOCS',
    href: '/docs',
  },
  {
    title: 'Home',
    href: '/',
    external: true,
  },
] as const;

type Locale = 'ko' | 'en';

// getNavigationWithLocale 함수 수정
const getNavigationWithLocale = (locale: Locale) => {
  const routes = getPageRoutes(locale);
  return [
    ...DEFAULT_NAVIGATION,
    ...routes.map((route) => ({
      title: route.title,
      href: route.href.replace('/ko/', `/${locale}/`), // locale에 따라 경로 동적 변경
    })),
  ];
};

export const Navigations = () => {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>('ko');
  const [navigation, setNavigation] = useState(() =>
    getNavigationWithLocale('ko'),
  );

  // localStorage의 값을 가져오는 함수
  const getCurrentLocale = (): Locale => {
    const savedLocale =
      localStorage.getItem('i18nextLng') || 'ko';
    return savedLocale.includes('en') ? 'en' : 'ko';
  };

  // 네비게이션 업데이트 함수
  const updateNavigation = (newLocale: Locale) => {
    setLocale(newLocale);
    setNavigation(getNavigationWithLocale(newLocale));
  };

  useEffect(() => {
    setMounted(true);

    // 초기 설정
    updateNavigation(getCurrentLocale());

    // storage 이벤트 리스너
    const handleStorageChange = () => {
      updateNavigation(getCurrentLocale());
    };

    // i18next 언어 변경 감지를 위한 interval 설정
    const checkLocaleInterval = setInterval(() => {
      const currentLocale = getCurrentLocale();
      if (currentLocale !== locale) {
        updateNavigation(currentLocale);
      }
    }, 100);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange,
      );
      clearInterval(checkLocaleInterval);
    };
  }, [locale]);

  if (!mounted) {
    return navigation;
  }

  return navigation;
};
