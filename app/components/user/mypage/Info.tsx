'use client';

import { useAuthMutation } from '@/app/hooks/mutations/auth/useAuthMutation';
import { useAuthStore } from '@/app/store/auth.store';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SideMenu from '../../layout/SideMenu';
import styles from './style/Info.module.css';

const Info = () => {
  const { userInfo, setOtpTab } = useAuthStore();
  const { findPassword } = useAuthMutation();
  const [windowWidth, setWindowWidth] = useState(0);
  const { t } = useTranslation('common');
  const [remainingDays, setRemainingDays] =
    useState<number>(0);
  const { token } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: t('sideMenu.myInfo'), path: '/mypage/' },
    {
      label: t('sideMenu.licenseInfo'),
      path: '/mypage/license',
    },
    {
      label: t('sideMenu.addressBook'),
      path: '/mypage/address',
    },
  ];

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

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

  const isMobile = windowWidth === 0 || windowWidth < 1100;

  return (
    <section id={styles.info}>
      {!isMobile && <SideMenu />}
      {isMobile && (
        <div className={styles.mobileMenu}>
          <div
            className={styles.linkTitle}
            onClick={handleMenuClick}
          >
            <strong>{t('sideMenu.myInfo')}</strong>
            <span
              className={`${styles.arrow} ${isMenuOpen ? styles.open : ''}`}
            ></span>
          </div>
          {isMenuOpen && (
            <div className={styles.menuItems}>
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className={styles.menuItem}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      <div className={styles.sectionRight}>
        <div className={styles.rightInner}>
          {isMobile && (
            <p>
              {t('sideMenu.p')}
              <span> {remainingDays}</span>
              <span>{t('sideMenu.p_end')}</span>
            </p>
          )}
          <h2>
            {t('myPage.info.h2')}{' '}
            <span>{userInfo.nickname}</span>{' '}
            {t('myPage.info.h2_end')}
          </h2>
          <div className={styles.rightInfo}>
            <div>
              <div className={styles.name}>
                {t('myPage.info.name')}
              </div>
              <div className={styles.userName}>
                {userInfo.nickname}
              </div>
            </div>
            <div>
              <div className={styles.email}>
                {t('myPage.info.email')}
              </div>
              <div className={styles.userEmail}>
                {userInfo.email}
              </div>
            </div>
            <div>
              <div className={styles.id}>
                {t('myPage.info.id')}
              </div>
              <div className={styles.userId}>
                {userInfo.userName}
              </div>
            </div>
          </div>
          <button
            className={styles.infoBtn}
            onClick={() => {
              setOtpTab('otp');
              findPassword(userInfo.email);
            }}
          >
            {t('myPage.info.button')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Info;
