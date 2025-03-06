'use client';

import styles from '@/app/components/layout/style/Header.module.css';
import { useAuthMutation } from '@/app/hooks/mutations/auth/useAuthMutation';
import { useMainQuery } from '@/app/hooks/queries/main/useMainQuery';
import { useAuthStore } from '@/app/store/auth.store';
import { useModalStore } from '@/app/store/modal.store';
import { useOsStore } from '@/app/store/os.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MailModal } from '../common/modals';

const Header = () => {
  const { t, i18n } = useTranslation('common');
  const {
    token,
    userInfo,
    setLoginTab,
    setIsAdminLoggedIn,
    setIsIdFound,
  } = useAuthStore();
  const { logout } = useAuthMutation();
  const { ModalStates, toggleState } = useModalStore();
  const { downloadOptions } = useMainQuery();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    i18n.language === 'en' ? 'EN' : 'KR',
  );

  const { osType } = useOsStore();
  const isMyPage = pathname.includes('/mypage');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const handleLogout = () => {
    logout();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDownloadLink = () => {
    if (!downloadOptions || downloadOptions.length === 0) {
      console.log('다운로드 옵션이 없습니다.');
      return '';
    }

    const userAgent = navigator.userAgent.toLowerCase();
    let osTypeCode: string;

    // OS 감지 및 os_type 코드 매핑
    if (/windows/.test(userAgent)) {
      osTypeCode = '0';
    } else if (/macintosh|mac os x/.test(userAgent)) {
      osTypeCode = '2';
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      osTypeCode = '4';
    } else if (/android/.test(userAgent)) {
      osTypeCode = '3';
    } else {
      osTypeCode = '0'; // 기본값으로 Windows
    }

    // downloadOptions 배열에서 일치하는 OS 찾기
    const downloadOption = downloadOptions.find(
      (option) => option.os_type === osTypeCode,
    );

    console.log('감지된 OS 코드:', osTypeCode);
    console.log('사용 가능한 옵션들:', downloadOptions);
    console.log(
      '선택된 옵션:',
      downloadOption || '일치하는 옵션 없음',
    );

    return (
      downloadOption?.download_link ||
      downloadOptions[0]?.download_link ||
      ''
    );
  };

  return (
    <header
      id={styles.header}
      className={isMyPage ? styles.mypage : ''}
    >
      {isMobile ? (
        <div className={styles.mobileWrapper}>
          <div className={styles.moblieWrap}>
            <a
              href=''
              className={styles.lang}
              onClick={handleLanguageChange}
            >
              {currentLang}{' '}
              <img src='/img/menu_sub.svg' alt='menuSub' />
            </a>
            <a
              href=''
              onClick={(e) => {
                e.preventDefault();
                handleMenuToggle();
              }}
            >
              <img src='/img/m_menu.svg' alt='menuSub' />
            </a>
            <div
              className={`${styles.mobileNav} ${isMenuOpen ? styles.on : ''}`}
            >
              <div className={styles.navTop}>
                <a
                  href=''
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuToggle();
                  }}
                >
                  <img
                    src='/img/m_menu_close.svg'
                    alt='m_menu_close'
                  />
                </a>
                <img
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  src='/img/logo.svg'
                  alt='logo'
                  className={styles.mLogo}
                />
              </div>
              <ul className={styles.mobileNavMenu}>
                <li>
                  <Link href='/product'>
                    {t('header.nav.product')}
                  </Link>
                </li>
                <li>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      const link = getDownloadLink();
                      if (link) {
                        window.open(link, '_blank');
                      }
                    }}
                  >
                    {t('header.nav.download')}
                  </a>
                </li>
                <li>
                  <Link
                    href={`/support/${currentLang === 'KR' ? 'ko' : 'en'}/quickly_start`}
                  >
                    {t('header.nav.support')}
                  </Link>
                </li>
              </ul>
              <ul className={styles.mobileNavSub}>
                <li>
                  <a
                    href=''
                    onClick={(e) => {
                      e.preventDefault();
                      toggleState('WATCHCON.mail');
                      handleMenuToggle();
                    }}
                  >
                    {t('header.utils.inquiry')}
                  </a>
                </li>
                <li>
                  {token ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '30px',
                      }}
                    >
                      <Link href='/mypage'>
                        {userInfo.nickname}
                      </Link>
                      <Link href='' onClick={handleLogout}>
                        {t('header.utils.logout')}
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href='/login'
                      onClick={() => setLoginTab('login')}
                    >
                      {t('header.utils.login')}
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.desktopMenu}>
          <div className={styles.logo}>
            <h1>
              <Link href='/'>
                {isMyPage ? (
                  <img
                    src='/img/logo_w.svg'
                    alt='logo'
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <img
                    src='/img/logo.svg'
                    alt='logo'
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </Link>
            </h1>
          </div>
          <div className={styles.menuWrap}>
            <ul className={styles.utils}>
              <li>
                {token ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '30px',
                    }}
                  >
                    <Link href='/mypage'>
                      [{userInfo.nickname}]
                    </Link>
                    <Link href='' onClick={handleLogout}>
                      {t('header.utils.logout')}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href='/login'
                    onClick={() => {
                      setLoginTab('login');
                      setIsIdFound(false);
                    }}
                  >
                    {t('header.utils.login')}
                  </Link>
                )}
              </li>

              <li>
                <a
                  href=''
                  onClick={(e) => {
                    e.preventDefault();
                    toggleState('WATCHCON.mail');
                  }}
                >
                  {t('header.utils.inquiry')}
                </a>
              </li>
              <li>
                {token ? (
                  userInfo.isAdmin ? (
                    <Link
                      href='/admin/ecommerce'
                      onClick={() =>
                        setIsAdminLoggedIn(true)
                      }
                    >
                      {t('header.utils.Manager')}
                    </Link>
                  ) : null
                ) : null}
              </li>
            </ul>
            <ul className={styles.menu}>
              <li>
                <Link href='/product'>
                  {t('header.nav.product')}
                </Link>
              </li>
              <li>
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    const link = getDownloadLink();
                    if (link) {
                      window.open(link, '_blank');
                    }
                  }}
                >
                  {t('header.nav.download')}
                </a>
              </li>
              <li>
                <Link
                  href={`/support/${currentLang === 'KR' ? 'ko' : 'en'}/quickly_start`}
                >
                  {t('header.nav.support')}
                </Link>
              </li>
              <li>
                <a href='' onClick={handleLanguageChange}>
                  {currentLang}{' '}
                  {isMyPage ? (
                    <img
                      src='/img/menu_sub_w.png'
                      alt='logo'
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <img
                      src='/img/menu_sub.svg'
                      alt='menuSub'
                    />
                  )}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {ModalStates.WATCHCON.mail && (
        <MailModal
          isOpen={ModalStates.WATCHCON.mail}
          onClose={() => toggleState('WATCHCON.mail')}
          title='문의하기'
        />
      )}
    </header>
  );
};

export default Header;
