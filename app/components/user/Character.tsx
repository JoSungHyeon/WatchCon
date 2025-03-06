'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './style/Character.module.css';

const Character = () => {
  const { t } = useTranslation('common');

  const slideData = [
    {
      num: 1,
      title: t('mainPage.character.data.slide1.title'),
      desc: t('mainPage.character.data.slide1.desc'),
    },
    {
      num: 2,
      title: t('mainPage.character.data.slide2.title'),
      desc: t('mainPage.character.data.slide2.desc'),
    },
    {
      num: 3,
      title: t('mainPage.character.data.slide3.title'),
      desc: t('mainPage.character.data.slide3.desc'),
    },
    {
      num: 4,
      title: t('mainPage.character.data.slide4.title'),
      desc: t('mainPage.character.data.slide4.desc'),
    },
    {
      num: 5,
      title: t('mainPage.character.data.slide5.title'),
      desc: t('mainPage.character.data.slide5.desc'),
    },
    {
      num: 6,
      title: t('mainPage.character.data.slide6.title'),
      desc: t('mainPage.character.data.slide6.desc'),
    },
  ];
  const characterWrapRef = useRef(null);
  const itemWrapRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1300);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () =>
      window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: characterWrapRef.current,
          start: 'top + 120px',
          end: '+=120%',
          pin: true,
          scrub: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.to(itemWrapRef.current, {
        yPercent: -150,
        ease: 'power2.out',
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }
  }, [isMobile]);

  return (
    <section
      data-section='character'
      id={styles.character}
      ref={characterWrapRef}
    >
      <div className={styles.characterInner}>
        <div className={styles.textWrap}>
          <h3>{t('mainPage.character.h3')}</h3>
          <strong>
            <span className={styles.pointColor}>
              WatchCon
            </span>
            {t('mainPage.character.strong.strong_black')}
            <span className={styles.pointBg}>
              {t('mainPage.character.strong.strong_point')}
            </span>
            {t('mainPage.character.strong.strong_end')}
          </strong>
          <p>{t('mainPage.character.p')}</p>
        </div>
        {isMobile ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={1.5}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              600: {
                slidesPerView: 2.5,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className={styles.mobileSwiper}
          >
            {slideData.map((item, i) => (
              <SwiperSlide
                key={i}
                className={styles.swiperSlide}
              >
                <div className={styles.item}>
                  <img
                    src={`/img/character/c_${item.num}.png`}
                    alt={`item_${item.num}`}
                  />
                  <div className={styles.itemDesc}>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            className={styles.itemWrap}
            ref={itemWrapRef}
          >
            {Array.from(
              { length: Math.ceil(slideData.length / 3) },
              (_, index) => (
                <div key={index}>
                  {slideData
                    .slice(index * 3, (index + 1) * 3)
                    .map((item, i) => (
                      <div className={styles.item} key={i}>
                        <img
                          src={`/img/character/c_${item.num}.png`}
                          alt={`item_${item.num}`}
                        />
                        <div className={styles.itemDesc}>
                          <strong>{item.title}</strong>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Character;
