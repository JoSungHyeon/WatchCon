'use client';

import styles from './style/Intro.module.css';

import { useOsStore } from '@/app/store/os.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IntroProps {
  downloadOptions: {
    download_link: string;
  }[];
}

const Intro: React.FC<IntroProps> = ({
  downloadOptions,
}) => {
  const { t } = useTranslation('common');
  const { osType } = useOsStore();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  const checkIfMobile = () => {
    if (typeof window !== 'undefined') {
      const userAgent =
        navigator.userAgent || navigator.vendor;
      setIsMobile(
        /android|iPad|iPhone|iPod/.test(userAgent),
      );
    }
  };

  useEffect(() => {
    checkIfMobile(); // 초기값 설정

    // 화면 크기 변경 시 업데이트
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const getDownloadLink = () => {
    switch (osType) {
      case 'MacOS':
        return downloadOptions[3].download_link;
      case 'Windows':
      case 'Linux':
        return downloadOptions[0].download_link;
      case 'iOS':
        return downloadOptions[1].download_link;
      case 'Android':
        return downloadOptions[2].download_link;
      default:
        return downloadOptions[0].download_link;
    }
  };

  return (
    <section
      data-section='intro'
      className={`${styles.intro} ${isMobile ? styles.narrow : ''}`}
      id={styles.intro}
    >
      <div className={styles.introInner}>
        <div className={styles.textWrap}>
          <div className={styles.textTop}>
            <img
              src='/img/intro/main_txt.png'
              alt='메인텍스트'
            />
            <p>{t('mainPage.intro.p')}</p>
          </div>
          <div className={styles.textBottom}>
            <strong>{t('mainPage.intro.strong')}</strong>
          </div>
        </div>
        <div className={styles.btnWrap}>
          <button
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              window.open(getDownloadLink(), '_blank');
            }}
          >
            <p>{t('mainPage.intro.download')}</p>
            <img
              src='/img/intro/download.png'
              alt='download'
            />
          </button>
          <button onClick={() => router.push('/license')}>
            <p>{t('mainPage.intro.license')}</p>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Intro;
