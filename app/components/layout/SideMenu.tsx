import { useAuthMutation } from '@/app/hooks/mutations/auth/useAuthMutation';
import { useAuthStore } from '@/app/store/auth.store';
import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './style/SideMenu.module.css';

const SideMenu = () => {
  const { token } = useAuthStore();
  const [remainingDays, setRemainingDays] =
    useState<number>(0);

  const { t, i18n } = useTranslation('common');
  const pathname = usePathname();
  const { logout } = useAuthMutation();

  const [currentLang, setCurrentLang] = useState(
    i18n.language === 'en' ? 'EN' : 'KR',
  );

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLang(savedLanguage === 'ko' ? 'KR' : 'EN');
    } else {
      const defaultLang = 'ko';
      i18n.changeLanguage(defaultLang);
      setCurrentLang('KR');
      localStorage.setItem('i18nextLng', defaultLang);
    }
  }, [i18n]);

  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        console.log('API 호출 시작, token:', token);

        const response = await axios.get(
          'https://api-node-s45.watchcons.com/api/user/license/list',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log('API 응답:', response.data);

        console.log(
          response.data.data.list[0].user_license[0]
            .published_license.license_expired_time,
        );

        if (
          response.data?.data?.list[0]?.user_license[0]
            ?.published_license?.license_expired_time
        ) {
          const expireDate = new Date(
            response.data.data.list[0].user_license[0].published_license.license_expired_time,
          );
          const today = new Date();

          console.log('만료일:', expireDate);
          console.log('현재일:', today);

          const diffTime =
            expireDate.getTime() - today.getTime();
          const diffDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24),
          );

          console.log('계산된 남은 일수:', diffDays);
          setRemainingDays(diffDays > 0 ? diffDays : 0);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API 오류:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        } else {
          console.error('알 수 없는 오류:', error);
        }
      }
    };

    if (token) {
      fetchLicenseData();
    } else {
      console.log('토큰이 없습니다.');
    }
  }, [token]);

  const handleLanguageChange = (e: React.MouseEvent) => {
    e.preventDefault();

    const newLang = currentLang === 'KR' ? 'EN' : 'KR';
    const langCode = newLang === 'KR' ? 'ko' : 'en';

    i18n.changeLanguage(langCode);
    setCurrentLang(newLang);

    localStorage.setItem('i18nextLng', langCode);
    document.cookie = `preferredLanguage=${langCode}; path=/; max-age=31536000`;

    const currentPath = window.location.pathname;

    if (currentPath.includes('/support/')) {
      const newPath = currentPath.replace(
        /^\/support\/(ko|en)/,
        `/support/${langCode}`,
      );

      window.location.href = newPath;
      i18n.changeLanguage(langCode);
      return;
    }
  };

  return (
    <div className={styles.sideMenuWrap}>
      <div className={styles.sideMenuInner}>
        <div className={styles.sideTop}>
          <h2>{t('sideMenu.h2')}</h2>
          <p>
            {t('sideMenu.p')}
            <span> {remainingDays}</span>
            <span>{t('sideMenu.p_end')}</span>
          </p>
        </div>
        <div className={styles.sideMiddle}>
          <Link
            href='/mypage'
            className={
              pathname === '/mypage' ? styles.on : ''
            }
          >
            {t('sideMenu.myInfo')}
          </Link>
          <Link
            href='/mypage/license'
            className={
              pathname === '/mypage/license'
                ? styles.on
                : ''
            }
          >
            {t('sideMenu.licenseInfo')}
          </Link>
          <Link
            href='/mypage/address'
            className={
              pathname === '/mypage/address'
                ? styles.on
                : ''
            }
          >
            {t('sideMenu.addressBook')}
          </Link>
        </div>
        <div className={styles.sideBottom}>
          <ul>
            <li>
              {token ? (
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  {t('sideMenu.logout')}
                </a>
              ) : (
                <a href='/login'>{t('sideMenu.login')}</a>
              )}
            </li>
            <li>
              <a onClick={handleLanguageChange} href=''>
                {t('sideMenu.language')}
                <span>▼</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
