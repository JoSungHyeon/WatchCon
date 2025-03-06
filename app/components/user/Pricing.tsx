'use client';
import { useMainQuery } from '@/app/hooks/queries/main/useMainQuery';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './style/Pricing.module.css';

type PriceItem = {
  name: string;
  price: string;
  priceType: string;
  type: string;
  text?: string;

  list: {
    text: string;
    checked?: boolean;
  }[];
};

const Pricing = () => {
  const { t } = useTranslation('common');
  const { priceData, featureLimitData } = useMainQuery();
  const [isMobile, setIsMobile] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState('KRW');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1500);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () =>
      window.removeEventListener('resize', checkMobile);
  }, []);

  // 현재 날짜에 해당하는 가격 정보를 찾는 함수
  const getCurrentPrice = () => {
    if (!priceData || priceData.length === 0) return null;

    const currentDate = new Date();
    // priceData 배열에서 현재 날짜에 해당하는 가격 정보를 찾습니다
    return (
      priceData.find((price) => {
        const startDate = new Date(price.start_date);
        const endDate = new Date(price.end_date);
        return (
          currentDate >= startDate && currentDate <= endDate
        );
      }) || priceData[priceData.length - 1]
    ); // 해당하는 날짜가 없으면 최신 가격 사용
  };

  const currentPriceData = getCurrentPrice();

  const priceDataConfig: PriceItem[] = [
    {
      name: t('mainPage.pricing.data.data1.name'),
      price: `${currency === 'USD' ? '$' : '₩'}0`,
      priceType: ``,
      text: t('mainPage.pricing.data.data1.text'),
      type: t('mainPage.pricing.data.data1.type'),
      list: [
        {
          text: t('mainPage.pricing.data.data1.list.list1'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data1.list.list2'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data1.list.list3'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data1.list.list4'),
          checked: true,
        },
      ],
    },
    {
      name: t('mainPage.pricing.data.data2.name'),
      price: currentPriceData?.[
        currency === 'USD' ? 'basic_usd' : 'basic_kw'
      ]
        ? `${currency === 'USD' ? '$' : '₩'}${(isYearly
            ? currentPriceData[
                currency === 'USD'
                  ? 'basic_usd'
                  : 'basic_kw'
              ] * 12
            : currentPriceData[
                currency === 'USD'
                  ? 'basic_usd'
                  : 'basic_kw'
              ]
          ).toLocaleString()}`
        : t('mainPage.pricing.data.data2.price'),
      priceType: `${isYearly ? t('mainPage.pricing.yearly') : t('mainPage.pricing.monthly')}`,
      text: t('mainPage.pricing.data.data2.text'),
      type: t('mainPage.pricing.data.data2.type'),

      list: [
        {
          text: t('mainPage.pricing.data.data2.list.list1'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list2'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list3'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list4'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list5'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list6'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list7'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list8'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data2.list.list9'),
          checked: true,
        },
        {
          text: t(
            'mainPage.pricing.data.data2.list.list10',
          ),
          checked: true,
        },
        {
          text: t(
            'mainPage.pricing.data.data2.list.list11',
          ),
          checked: true,
        },
      ],
    },
    {
      name: t('mainPage.pricing.data.data3.name'),
      price: currentPriceData?.[
        currency === 'USD' ? 'premium_usd' : 'premium_kw'
      ]
        ? `${currency === 'USD' ? '$' : '₩'}${(isYearly
            ? currentPriceData[
                currency === 'USD'
                  ? 'premium_usd'
                  : 'premium_kw'
              ] * 12
            : currentPriceData[
                currency === 'USD'
                  ? 'premium_usd'
                  : 'premium_kw'
              ]
          ).toLocaleString()}`
        : t('mainPage.pricing.data.data3.price'),
      priceType: `${isYearly ? t('mainPage.pricing.yearly') : t('mainPage.pricing.monthly')}`,
      text: t('mainPage.pricing.data.data3.text'),
      type: t('mainPage.pricing.data.data3.type'),
      list: [
        {
          text: t('mainPage.pricing.data.data3.list.list1'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list2'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list3'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list4'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list5'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list6'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list7'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list8'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data3.list.list9'),
          checked: true,
        },
        {
          text: t(
            'mainPage.pricing.data.data3.list.list10',
          ),
          checked: true,
        },
        {
          text: t(
            'mainPage.pricing.data.data3.list.list11',
          ),
          checked: true,
        },
      ],
    },
    {
      name: t('mainPage.pricing.data.data4.name'),
      price: currentPriceData?.[
        currency === 'USD' ? 'business_usd' : 'business_kw'
      ]
        ? `${currency === 'USD' ? '$' : '₩'}${(isYearly
            ? currentPriceData[
                currency === 'USD'
                  ? 'business_usd'
                  : 'business_kw'
              ] * 12
            : currentPriceData[
                currency === 'USD'
                  ? 'business_usd'
                  : 'business_kw'
              ]
          ).toLocaleString()}`
        : t('mainPage.pricing.data.data4.price'),
      priceType: `${isYearly ? t('mainPage.pricing.yearly') : t('mainPage.pricing.monthly')}`,
      text: t('mainPage.pricing.data.data4.text'),
      type: t('mainPage.pricing.data.data4.type'),

      list: [
        {
          text: t('mainPage.pricing.data.data4.list.list1'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list2'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list3'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list4'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list5'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list6'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list7'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list8'),
          checked: true,
        },
        {
          text: t('mainPage.pricing.data.data4.list.list9'),
          checked: true,
        },
        {
          text: t(
            'mainPage.pricing.data.data4.list.list10',
          ),
          checked: true,
        },
        {
          text: t(
            'mainPage.pricing.data.data4.list.list11',
          ),
          checked: true,
        },
      ],
    },
  ];

  return (
    <section data-section='pricing' id={styles.pricing}>
      <div className={styles.pricingInner}>
        <div className={styles.pricingTop}>
          <div className={styles.pricingTitle}>
            <h2>{t('mainPage.pricing.h2')}</h2>
            <p>{t('mainPage.pricing.p')}</p>
          </div>
          {/* {isMobile ? null : (
            <div className={styles.currencyToggle}>
              <button
                className={`${currency === 'USD' ? styles.on : ''}`}
                onClick={() => setCurrency('USD')}
              >
                USD
              </button>
              <button
                className={`${currency === 'KRW' ? styles.on : ''}`}
                onClick={() => setCurrency('KRW')}
              >
                KRW
              </button>
            </div>
          )} */}
        </div>
        <div className={styles.pricingBottom}>
          <div className={styles.pricingBottomInner}>
            <div className={styles.priceToggle}>
              <button
                className={`${!isYearly ? styles.on : ''}`}
                onClick={() => setIsYearly(false)}
              >
                {t('mainPage.pricing.monthly')}
              </button>
              <button
                className={`${isYearly ? styles.on : ''}`}
                onClick={() => setIsYearly(true)}
              >
                {t('mainPage.pricing.yearly')}
              </button>
            </div>

            {/* {isMobile ? (
              <div className={styles.currencyToggle}>
                <button
                  className={`${currency === 'USD' ? styles.on : ''}`}
                  onClick={() => setCurrency('USD')}
                >
                  USD
                </button>
                <button
                  className={`${currency === 'KRW' ? styles.on : ''}`}
                  onClick={() => setCurrency('KRW')}
                >
                  KRW
                </button>
              </div>
            ) : null} */}
          </div>
          <div className={styles.priceWrapper}>
            {priceDataConfig.map((d, i) => (
              <div className={styles.priceItem} key={i}>
                <div className={styles.priceItemTop}>
                  <i>{d.name}</i>
                  <strong>{d.price}</strong>
                  <div>{d.priceType}</div>
                  <p>{d.text}</p>
                </div>
                <div className={styles.priceItemBottom}>
                  {d.list.map((list, j) => (
                    <span
                      key={j}
                      className={`${list.checked === false ? styles.unchecked : ''}`}
                    >
                      {typeof list === 'object'
                        ? list.text
                        : list}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link href='/license'>More & Purchase</Link>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
