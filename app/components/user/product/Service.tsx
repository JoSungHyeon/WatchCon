'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './style/Service.module.css';

const Service: FC = () => {
  console.log('Service is rendered');

  const { t } = useTranslation('common');
  const serviceData = [
    {
      strong: t('productPage.item.item1.strong'),
    },
    {
      strong: t('productPage.item.item2.strong'),
    },
    {
      strong: t('productPage.item.item3.strong'),
    },
    {
      strong: t('productPage.item.item4.strong'),
    },
    {
      strong: t('productPage.item.item5.strong'),
    },
    {
      strong: t('productPage.item.item6.strong'),
    },
    {
      strong: t('productPage.item.item7.strong'),
    },
    {
      strong: t('productPage.item.item8.strong'),
    },
    {
      strong: t('productPage.item.item9.strong'),
    },
    {
      strong: t('productPage.item.item10.strong'),
    },
    {
      strong: t('productPage.item.item11.strong'),
    },
  ];

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () =>
      window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <section id={styles.service}>
        <div className={styles.serviceInner}>
          {isMobile ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1.5}
              breakpoints={{
                320: {
                  slidesPerView: 1.5,
                  spaceBetween: 10,
                },
                600: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                900: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
              className={styles.mobileSwiper}
            >
              {serviceData.map((d, i) => (
                <SwiperSlide
                  key={i}
                  className={styles.swiperSlide}
                >
                  <div
                    className={styles.serviceItem}
                    key={i}
                  >
                    <div className={styles.serviceImg}>
                      <img
                        src={`/img/service/s_${i + 1}.png`}
                        className={styles.imgBg}
                        alt={`serviece_item${i + 1}`}
                      />
                    </div>
                    <div className={styles.serviceDesc}>
                      <strong>{d.strong}</strong>
                      {/* <p
                        className={
                          [2, 4, 5, 7, 9].includes(i)
                            ? styles.white
                            : ''
                        }
                      >
                        {d.p}
                      </p> */}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            serviceData.map((d, i) => (
              <div className={styles.serviceItem} key={i}>
                <div className={styles.serviceImg}>
                  <img
                    src={`/img/service/s_${i + 1}.png`}
                    className={styles.imgBg}
                    alt={`serviece_item${i + 1}`}
                  />
                </div>
                <div className={styles.serviceDesc}>
                  <strong>{d.strong}</strong>
                  {/* <p
                    className={
                      [2, 4, 5, 7, 9].includes(i)
                        ? styles.white
                        : ''
                    }
                  >
                    {d.p}
                  </p> */}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <div className={styles.platform}>
        <div className={styles.textWrap}>
          <h3>Windows, MacOS, Android, iOS</h3>
          <p>{t('productPage.platform_p')}</p>
        </div>
        <ul>
          <li>
            <a href=''>
              <img
                src='/img/service/p_1.png'
                alt='platform1'
              />
            </a>
          </li>
          <li>
            <a href=''>
              <img
                src='/img/service/p_2.png'
                alt='platform2'
              />
            </a>
          </li>
          <li>
            <a href=''>
              <img
                src='/img/service/p_3.png'
                alt='platform3'
              />
            </a>
          </li>
          <li>
            <a href=''>
              <img
                src='/img/service/p_4.png'
                alt='platform4'
              />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Service;
