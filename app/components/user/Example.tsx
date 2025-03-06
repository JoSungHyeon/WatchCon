'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './style/Example.module.css';

const Example: React.FC = () => {
  const { t } = useTranslation('common');
  const [isMobile, setIsMobile] = useState(false);

  const exampleData: string[] = [
    t('mainPage.example.data.data1'),
    t('mainPage.example.data.data2'),
    t('mainPage.example.data.data3'),
    t('mainPage.example.data.data4'),
    t('mainPage.example.data.data5'),
    t('mainPage.example.data.data6'),
    t('mainPage.example.data.data7'),
    t('mainPage.example.data.data8'),
  ];

  const swiperRef = useRef<SwiperType>(null);

  const handleNext = (): void => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = (): void => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1300);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () =>
      window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section data-section='example' id={styles.example}>
      <div className={styles.exampleInner}>
        <div className={styles.exampleText}>
          <h2>{t('mainPage.example.h2')}</h2>
          <strong>
            <span>WatchCon</span>
            {t('mainPage.example.strong')}
          </strong>
        </div>
        <div className={styles.exampleSwiperWrap}>
          {!isMobile ? (
            <>
              <div className={styles.customNavigation}>
                <button onClick={handlePrev}>이전</button>
                <button onClick={handleNext}>다음</button>
              </div>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                breakpoints={{
                  400: {
                    slidesPerView: 1, // 모바일 화면에서 한 번에 1개 슬라이드
                  },
                  600: {
                    slidesPerView: 3, // 태블릿 화면에서 한 번에 3개 슬라이드
                  },
                  1024: {
                    slidesPerView: 5, // 데스크탑 화면에서 한 번에 5개 슬라이드
                  },
                }}
              >
                {exampleData.map((d, i) => (
                  <SwiperSlide
                    className={styles.swiperSlide}
                    key={i}
                  >
                    <img
                      src={`/img/example/e_${i + 1}.png`}
                      alt={`example_item_${i + 1}`}
                    />
                    <p>{d}</p>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <div className={styles.mobileItemWrap}>
              {exampleData.map((d, i) => (
                <div className={styles.mobileItem} key={i}>
                  <img
                    src={`/img/example/e_${i + 1}.png`}
                    alt={`example_item_${i + 1}`}
                  />
                  <p>{d}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Example;
