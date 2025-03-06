'use client';

import Header from '@/app/components/layout/Header';
import styles from '@/app/components/user/license/style/License.module.css';
import { useMainQuery } from '@/app/hooks/queries/main/useMainQuery';
import { useMainStore } from '@/app/store/main.store';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const LicensePage: React.FC = () => {
  const { t } = useTranslation('common');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  const [payUnit, setPayUnit] = useState('KW');
  const [todayPrice, setTodayPrice] = useState<any>(null);
  const { setPrice, setLicenseType, setFeatureId } =
    useMainStore();

  const { priceData, featureLimitData } = useMainQuery();

  useEffect(() => {
    if (!priceData?.length) return;

    // 날짜 처리를 더 안전하게 수정
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const foundTodayPrice = priceData.find((price) => {
      try {
        const startDate = new Date(price.start_date)
          .toISOString()
          .split('T')[0];
        const endDate = new Date(price.end_date)
          .toISOString()
          .split('T')[0];
        return (
          startDate <= todayString && endDate >= todayString
        );
      } catch (error) {
        console.error('날짜 처리 중 오류 발생:', error);
        return false;
      }
    });

    setTodayPrice(foundTodayPrice || priceData[0]);

    if (foundTodayPrice) {
      setPrice({
        kw: foundTodayPrice[`${payUnit}_kw`],
        usd: foundTodayPrice[`${payUnit}_usd`],
      });
    }
  }, [priceData, setPrice, payUnit]);

  const handlePurchaseClick = (columnIndex: number) => {
    if (!priceData?.length) return;

    // 첫 번째 컬럼은 free 버전이므로 그대로 columnIndex를 사용
    const licenseTypes = ['basic', 'premium', 'business'];
    const type = licenseTypes[columnIndex - 2];

    if (!type) return;

    const priceInfo = {
      kw: priceData[0][`${type}_kw`],
      usd: priceData[0][`${type}_usd`],
    };

    setPrice(priceInfo);
    setLicenseType(columnIndex);
    setFeatureId(featureLimitData[columnIndex].id);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  const licenseData = [
    {
      items: (
        <>
          <div className={styles.licenseType}>
            <i>Free</i>
            <strong>{t('licensePage.price')}</strong>
            <p>{t('licensePage.freeText')}</p>
          </div>
        </>
      ),
      key: 'Features Limits',
      security: 'check',
      multi: 'check',
      connection: 'check',
      monitoring: 'check',
      toRemote: 'Only 1',
      fromRemote: '',
      login: '1',
      mobile: '',
      file: '',
      group: '',
      address: '',
      favorites: '5',
      recently: '5',
      web: '',
      chat: '',
      link: false,
    },
    {
      items: (
        <>
          <div className={styles.licenseType}>
            <i>Lite</i>
            <strong>
              {payUnit === 'KW' && priceData?.length > 0
                ? `₩${todayPrice?.basic_kw || priceData[0]?.basic_kw} / ${t('licensePage.monthly')}`
                : `$${todayPrice?.basic_usd || priceData[0]?.basic_usd} / ${t('licensePage.monthly')}`}
            </strong>
            <p>{t('licensePage.liteText')}</p>
          </div>
        </>
      ),
      key: 'Features Limits',
      security: 'check',
      multi: 'check',
      connection: 'check',
      monitoring: 'check',
      toRemote: '3',
      fromRemote: '3',
      login: '5',
      mobile: 'check',
      file: 'check',
      group: '10',
      address: '50',
      favorites: '50',
      recently: '50',
      web: 'check',
      chat: 'check',
      link: true,
    },
    {
      items: (
        <>
          <div className={styles.licenseType}>
            <i>Premium</i>
            <strong>
              {payUnit === 'KW' && priceData?.length > 0
                ? `₩${todayPrice?.premium_kw || priceData[0]?.premium_kw} / ${t('licensePage.monthly')}`
                : `$${todayPrice?.premium_usd || priceData[0]?.premium_usd} / ${t('licensePage.monthly')}`}
            </strong>
            <p>{t('licensePage.premiumText')}</p>
          </div>
        </>
      ),
      key: 'Features Limits',
      security: 'check',
      multi: 'check',
      connection: 'check',
      monitoring: 'check',
      toRemote: '50',
      fromRemote: '10',
      login: '50',
      mobile: 'check',
      file: 'check',
      group: '50',
      address: '200',
      favorites: '200',
      recently: '200',
      web: 'check',
      chat: 'check',
      link: true,
    },
    {
      items: (
        <>
          <div className={styles.licenseType}>
            <i>Business</i>
            <strong>
              {payUnit === 'KW' && priceData?.length > 0
                ? `₩${todayPrice?.business_kw || priceData[0]?.business_kw} / ${t('licensePage.monthly')}`
                : `$${todayPrice?.business_usd || priceData[0]?.business_usd} / ${t('licensePage.monthly')}`}
            </strong>
            <p>{t('licensePage.businessText')}</p>
          </div>
        </>
      ),
      key: 'Features Limits',
      security: 'check',
      multi: 'check',
      connection: 'check',
      monitoring: 'check',
      toRemote: 'unlimit',
      fromRemote: '50',
      login: '200',
      mobile: 'check',
      file: 'check',
      group: '200',
      address: '500',
      favorites: 'unlimit',
      recently: 'unlimit',
      web: 'check',
      chat: 'check',
      link: true,
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* <select
          value={payUnit}
          onChange={(e) => setPayUnit(e.target.value)}
        >
          <option value='KW'>KW</option>
          <option value='USD'>USD</option>
        </select> */}
        {windowWidth >= 1100 ? (
          <div className={styles.tableContainer}>
            <table className={styles.licenseTable}>
              <thead>
                <tr>
                  <th></th>
                  {licenseData.map((license, index) => (
                    <th key={index}>{license.items}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Key Feature</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.key}</td>
                  ))}
                </tr>
                <tr>
                  <td>Security</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.security === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.security
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Multi Language</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.multi === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.multi
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Connection Password</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.connection === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.connection
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Monitoring</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.monitoring === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.monitoring
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>To Romote Connection</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.toRemote}</td>
                  ))}
                </tr>
                <tr>
                  <td>From Romote Connection</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.fromRemote}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Login account</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.login}</td>
                  ))}
                </tr>
                <tr>
                  <td>Mobile Device</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.mobile === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.mobile
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>File Transfer</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.file === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.file
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Address Group</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.group}</td>
                  ))}
                </tr>
                <tr>
                  <td>Address</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.address}</td>
                  ))}
                </tr>
                <tr>
                  <td>Favorites</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.favorites}</td>
                  ))}
                </tr>
                <tr>
                  <td>Recently</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>{license.recently}</td>
                  ))}
                </tr>
                <tr>
                  <td>Web - MyPage</td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.web === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.web
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    Chat / Voice / Screen Recording
                  </td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.chat === 'check' ? (
                        <img
                          src='/img/license/check.svg'
                          alt='check'
                        />
                      ) : (
                        license.chat
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td></td>
                  {licenseData.map((license, index) => (
                    <td key={index}>
                      {license.link && (
                        <button
                          onClick={() => {
                            handlePurchaseClick(index + 1);
                            window.location.href =
                              '/license/buy';
                          }}
                          className={styles.purchaseBtn}
                        >
                          Purchase
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <Swiper
            className={styles.swiperWrap}
            spaceBetween={50}
            slidesPerView={1}
          >
            {licenseData.map((license, index) => (
              <SwiperSlide key={index}>
                <div className={styles.swiperItem}>
                  <div className={styles.licenseType}>
                    <i>
                      {
                        license.items.props.children.props
                          .children[0].props.children
                      }
                    </i>
                    <strong>
                      {
                        license.items.props.children.props
                          .children[1].props.children
                      }
                    </strong>
                    <p>
                      {
                        license.items.props.children.props
                          .children[2].props.children
                      }
                    </p>
                  </div>
                  <table className={styles.licenseTable}>
                    <tbody>
                      <tr>
                        <td>Key Feature</td>
                      </tr>
                      <tr>
                        <td>Security</td>
                        <td>
                          {license.security === 'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.security
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Multi Language</td>
                        <td>
                          {license.multi === 'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.multi
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Connection Password</td>
                        <td>
                          {license.connection ===
                          'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.connection
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Monitoring</td>
                        <td>
                          {license.monitoring ===
                          'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.monitoring
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>To Remote Connection</td>
                        <td>{license.toRemote}</td>
                      </tr>
                      <tr>
                        <td>From Remote Connection</td>
                        <td>{license.fromRemote}</td>
                      </tr>
                      <tr>
                        <td>Login account</td>
                        <td>{license.login}</td>
                      </tr>
                      <tr>
                        <td>Mobile Device</td>
                        <td>
                          {license.mobile === 'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.mobile
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>File Transfer</td>
                        <td>
                          {license.file === 'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.file
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Address Group</td>
                        <td>{license.group}</td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td>{license.address}</td>
                      </tr>
                      <tr>
                        <td>Favorites</td>
                        <td>{license.favorites}</td>
                      </tr>
                      <tr>
                        <td>Recently</td>
                        <td>{license.recently}</td>
                      </tr>
                      <tr>
                        <td>Web - MyPage</td>
                        <td>
                          {license.web === 'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.web
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Chat / Voice / Screen Recording
                        </td>
                        <td>
                          {license.chat === 'check' ? (
                            <img
                              src='/img/license/check.svg'
                              alt='check'
                            />
                          ) : (
                            license.chat
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          {license.link && (
                            <button
                              onClick={() => {
                                handlePurchaseClick(
                                  index + 1,
                                );
                                window.location.href =
                                  '/license/buy';
                              }}
                              className={styles.purchaseBtn}
                            >
                              Purchase
                            </button>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default LicensePage;
