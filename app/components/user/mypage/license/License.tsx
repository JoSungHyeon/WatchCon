'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AlertModal } from '@/app/components/common/modals/AlertModal';
import {
  usePurchaseCancelMutation,
  useUpdateLicenseAutoRenewalMutation,
} from '@/app/hooks/mutations/mypage/usePurchaseMutation';
import { useLicenseQuery } from '@/app/hooks/queries/main/mypage/useLicenseQuery';
import { usePurchaseQuery } from '@/app/hooks/queries/main/mypage/usePurchaseQuery';
import { useAuthStore } from '@/app/store/auth.store';
import { useTranslation } from 'react-i18next';
import SideMenu from '../../../layout/SideMenu';
import styles from './style/License.module.css';

import {
  NICEPAY_CONFIG,
  getEdiDate,
  getSignData,
} from '../../../layout/nicepay';
const baseURL = process.env.NEXT_PUBLIC_API_URL;

interface PurchaseHistoryItem {
  id: string;
  is_repurchase: string;
  user_id: string;
  purchase_date: string;
  number_of_purchases: number;
  purchase_pay: number;
  license_type: string;
  license_no: string;
  price_id: string;
  discount_list_id: string;
  is_purchase_kw: string;
  purchase_subscribe_type: number;
  is_purchase_cancel: number;
  orderid_id: string;
  orderid_result: string;
  price_features_list_id: string;
  tid: string | null;
  created_at: string;
  updated_at: string;
}

interface LicenseInfo {
  id: string;
  user_id: string;
  license_type: string;
  auto_update: string;
  published_license: {
    license_update_type: string;
    license_no: string;
    published_time: string;
    license_expired_time: string;
  };
}

const License = () => {
  const { t } = useTranslation('common');
  const [windowWidth, setWindowWidth] = useState(0);
  const { data: licenseData, isLoading } =
    useLicenseQuery();
  const { data: purchaseHistory, refetch } =
    usePurchaseQuery();

  console.log(purchaseHistory?.data);

  const updateAutoRenewalMutation =
    useUpdateLicenseAutoRenewalMutation();

  const [isChecked, setIsChecked] =
    useState<boolean>(false);

  const purchaseCancelMutation =
    usePurchaseCancelMutation();

  const [showCancelModal, setShowCancelModal] =
    useState(false);
  const [selectedLicenseId, setSelectedLicenseId] =
    useState<string | number>('');

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

  const licenseInfo =
    licenseData?.data?.list?.[0]?.user_license?.map(
      (license: any) => ({
        id: license?.id ?? '',
        user_id: license?.user_id ?? '',
        license_type: license?.license_type ?? '',
        auto_update: license?.auto_update ?? '0',
        published_license: {
          license_update_type:
            license?.published_license
              ?.license_update_type ?? '',
          license_no:
            license?.published_license?.license_no ?? '',
          published_time:
            license?.published_license?.published_time ??
            '',
          license_expired_time:
            license?.published_license
              ?.license_expired_time ?? '',
        },
      }),
    ) ?? [];

  const isMobile = windowWidth === 0 || windowWidth < 1100;
  const isDesktop = windowWidth >= 1600;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = purchaseHistory?.data
    ? Math.ceil(purchaseHistory.data.length / itemsPerPage)
    : 1;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getCurrentPageItems = (): PurchaseHistoryItem[] => {
    if (!purchaseHistory?.data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return purchaseHistory.data.slice(startIndex, endIndex);
  };

  const handleCheck = async (
    event: React.ChangeEvent<HTMLInputElement>,
    license: LicenseInfo,
  ) => {
    const currentValue = license.auto_update === '1';
    const newValue = !currentValue;
    setIsChecked(newValue);

    if (license && licenseData?.data?.list?.[0]) {
      try {
        await updateAutoRenewalMutation.mutateAsync({
          id: license.id,
          auto_update: newValue ? 1 : 0,
        });
      } catch (error) {
        console.error(
          '자동 갱신 설정 업데이트 실패:',
          error,
        );
        setIsChecked(currentValue);
      }
    }
  };

  console.log(licenseInfo);

  const getLicenseTypeText = (type: string) => {
    return type === '1'
      ? 'Basic'
      : type === '2'
        ? 'Premium'
        : type === '3'
          ? 'Business'
          : '';
  };

  const getLicenseUpdateTypeText = (type: string) => {
    return type === '0'
      ? '1달'
      : type === '1'
        ? '1년'
        : type;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      '0',
    );
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const isWithin7Days = (dateString?: string) => {
    if (!dateString) return false;
    const publishedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime =
      currentDate.getTime() - publishedDate.getTime();
    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24),
    );
    return diffDays <= 7;
  };

  const handlePurchaseCancel = async (
    licenseId: string | number,
  ) => {
    try {
      await purchaseCancelMutation.mutateAsync({
        is_purchase_cancel: 1,
      });
      alert('구매가 성공적으로 취소되었습니다.');
      setShowCancelModal(false);
    } catch (error) {
      console.error('구매 취소 실패:', error);
      alert('구매 취소 중 오류가 발생했습니다.');
    }
  };

  const openCancelModal = (licenseId: string | number) => {
    setSelectedLicenseId(licenseId);
    setShowCancelModal(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const [showNicepayCancel, setShowNicepayCancel] =
    useState(false);
  const [cancelInfo, setCancelInfo] = useState({
    tid: '',
    moid: '',
    amount: '',
  });

  const { token, userInfo } = useAuthStore();
  const openNicepayCancelModal = async (
    licenseId: string | number,
  ) => {
    try {
      const response = await fetch(`${baseURL}/purchase`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (
        result.status_code === 200 &&
        result.data.length > 0
      ) {
        const purchaseItem = result.data.find(
          (item: any) =>
            item.license_no ===
            licenseInfo.find(
              (license) => license.id === licenseId,
            )?.published_license.license_no,
        );

        if (purchaseItem) {
          setCancelInfo({
            tid: purchaseItem.tid || '',
            moid: purchaseItem.orderId || '',
            amount: purchaseItem.purchase_pay.toString(),
          });
          setSelectedLicenseId(licenseId);
          setShowNicepayCancel(true);
        } else {
          alert(
            '해당 라이선스의 구매 정보를 찾을 수 없습니다.',
          );
        }
      } else {
        console.log(licenseId);
        alert('구매 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('구매 정보 조회 중 오류 발생:', error);
      alert('구매 정보 조회 중 오류가 발생했습니다.');
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const handleNicepayCancel = async () => {
    setIsProcessing(true);
    try {
      const ediDate = getEdiDate();
      const signData = getSignData(
        NICEPAY_CONFIG.merchantID +
          1004 +
          ediDate +
          NICEPAY_CONFIG.merchantKey,
      );

      console.log('cancelInfo', cancelInfo);
      console.log('merchantID', NICEPAY_CONFIG.merchantID);

      const response = await fetch(
        '/api/cancel-transaction',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            TID: cancelInfo.tid,
            Moid: cancelInfo.moid,
            CancelAmt: 1004,
            PartialCancelCode: '0',
            MID: NICEPAY_CONFIG.merchantID,
            EdiDate: ediDate,
            SignData: signData,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        await handlePurchaseCancel(selectedLicenseId);
        alert('거래 취소 성공');
        setShowNicepayCancel(false);
        refetch();
      } else {
        alert(result.message || '거래 취소 실패');
        setShowNicepayCancel(false);
      }
    } catch (error) {
      console.error('취소 오류:', error);
      alert('거래 취소 중 오류가 발생했습니다.');
      setShowNicepayCancel(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const shouldShowRenewalButton = (
    expiryDateString?: string,
  ) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const currentDate = new Date();

    const oneMonthBefore = new Date(expiryDate);
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

    console.log('만료일:', expiryDate);
    console.log('현재일:', currentDate);
    console.log('만료 1달전:', oneMonthBefore);
    console.log(
      '갱신버튼 표시 여부:',
      currentDate >= oneMonthBefore &&
        currentDate <= expiryDate,
    );

    return (
      currentDate >= oneMonthBefore &&
      currentDate <= expiryDate
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section id={styles.license}>
      {isDesktop && <SideMenu />}
      {isMobile && (
        <div className={styles.mobileMenu}>
          <div
            className={styles.linkTitle}
            onClick={handleMenuClick}
          >
            <strong>
              {t('myPage.license.licenseInfo.h2')}
            </strong>
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
        <div className={styles.licenseInner}>
          <div className={styles.licenseInfo}>
            {!isMobile ? (
              <>
                <h2>
                  {t('myPage.license.licenseInfo.h2')}
                </h2>
                <div className={styles.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          {t(
                            'myPage.license.licenseInfo.Lssue',
                          )}
                        </th>
                        <th>
                          {t(
                            'myPage.license.licenseInfo.Renewal',
                          )}
                        </th>
                        <th>
                          {t(
                            'myPage.license.licenseInfo.License',
                          )}
                        </th>
                        <th>
                          {t(
                            'myPage.license.licenseInfo.LicenseKey',
                          )}
                        </th>
                        <th>
                          {t(
                            'myPage.license.licenseInfo.Expire',
                          )}
                        </th>
                        {shouldShowRenewalButton(
                          licenseInfo[0]?.published_license
                            ?.license_expired_time,
                        ) && (
                          <th>
                            {t(
                              'myPage.license.licenseInfo.Renew',
                            )}
                          </th>
                        )}
                        {isWithin7Days(
                          licenseInfo[0]?.published_license
                            ?.published_time,
                        ) && (
                          <th>
                            {t(
                              'myPage.license.licenseInfo.cancel',
                            )}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {licenseInfo?.map((license) => (
                        <tr key={license.id}>
                          <td>
                            {formatDate(
                              license.published_license
                                .published_time,
                            )}
                          </td>
                          <td>
                            {getLicenseUpdateTypeText(
                              license.published_license
                                .license_update_type,
                            )}
                          </td>
                          <td>
                            {getLicenseTypeText(
                              license.license_type,
                            )}
                          </td>
                          <td className={styles.key}>
                            {
                              license.published_license
                                .license_no
                            }
                          </td>
                          <td>
                            {formatDate(
                              license.published_license
                                .license_expired_time,
                            )}
                          </td>
                          {shouldShowRenewalButton(
                            license.published_license
                              .license_expired_time,
                          ) && (
                            <td>
                              <Link
                                href='/license/buy'
                                className={styles.renewal}
                              >
                                갱신
                              </Link>
                            </td>
                          )}
                          {isWithin7Days(
                            license.published_license
                              .published_time,
                          ) && (
                            <td>
                              <button
                                onClick={() =>
                                  openNicepayCancelModal(
                                    license.id,
                                  )
                                }
                                className={
                                  styles.cancelButton
                                }
                              >
                                구매취소
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={styles.tableWrap}>
                {licenseInfo?.map((license) => (
                  <div
                    key={license.id}
                    className={styles.infoItem}
                  >
                    <div className={styles.itemLeft}>
                      <div className={styles.leftTop}>
                        <span className={styles.newDate}>
                          {formatDate(
                            license.published_license
                              .published_time,
                          )}
                        </span>
                        <span className={styles.type}>
                          {getLicenseTypeText(
                            license.license_type,
                          )}
                        </span>
                        <span className={styles.cycle}>
                          (
                          {getLicenseUpdateTypeText(
                            license.published_license
                              .license_update_type,
                          )}
                          )
                        </span>
                      </div>
                      <div className={styles.leftMiddle}>
                        <span className={styles.key}>
                          {
                            license.published_license
                              .license_no
                          }
                        </span>
                      </div>
                      <div className={styles.leftBottom}>
                        {shouldShowRenewalButton(
                          license.published_license
                            .license_expired_time,
                        ) && (
                          <Link
                            href='/license/buy'
                            className={styles.renewal}
                          >
                            갱신
                          </Link>
                        )}
                        {isWithin7Days(
                          license.published_license
                            .published_time,
                        ) && (
                          <button
                            onClick={() =>
                              openNicepayCancelModal(
                                license.id,
                              )
                            }
                            className={styles.cancelButton}
                          >
                            구매취소
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={styles.itemRight}>
                      <span className={styles.compDate}>
                        {formatDate(
                          license.published_license
                            .license_expired_time,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.licenseHistory}>
            {!isMobile ? (
              <>
                <h2>
                  {t('myPage.license.licenseHistory.h2')}
                </h2>
                <div className={styles.tableWrap}>
                  {purchaseHistory?.data?.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>NO</th>
                          <th>
                            {t(
                              'myPage.license.licenseHistory.table.Cycle',
                            )}
                          </th>
                          <th>
                            {t(
                              'myPage.license.licenseHistory.table.License',
                            )}
                          </th>
                          <th>
                            {t(
                              'myPage.license.licenseHistory.table.Date',
                            )}
                          </th>
                          <th>
                            {t(
                              'myPage.license.licenseHistory.table.LicenseKey',
                            )}
                          </th>
                          <th>
                            {t(
                              'myPage.license.licenseHistory.table.Expire',
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageItems().map(
                          (item, index) => (
                            <tr key={item.id}>
                              <td>
                                {(currentPage - 1) *
                                  itemsPerPage +
                                  index +
                                  1}
                              </td>
                              <td>
                                {getLicenseUpdateTypeText(
                                  item.purchase_subscribe_type.toString(),
                                )}
                              </td>
                              <td>
                                {getLicenseTypeText(
                                  item.license_type,
                                )}
                              </td>
                              <td>
                                {formatDate(
                                  item.purchase_date,
                                )}
                              </td>
                              <td className={styles.key}>
                                {item.license_no}
                              </td>
                              <td>
                                {formatDate(
                                  item.updated_at,
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className={styles.noData}>
                      구매 이력이 없습니다.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2>
                  {t('myPage.license.licenseHistory.h2')}
                </h2>
                <div className={styles.tableWrap}>
                  {purchaseHistory?.data?.length ? (
                    getCurrentPageItems().map((item) => (
                      <div
                        key={item.id}
                        className={styles.infoItem}
                      >
                        <div className={styles.itemLeft}>
                          <div className={styles.leftTop}>
                            <span
                              className={styles.newDate}
                            >
                              {formatDate(
                                item.purchase_date,
                              )}
                            </span>
                            <span className={styles.type}>
                              {getLicenseTypeText(
                                item.license_type,
                              )}
                            </span>
                            <span className={styles.cycle}>
                              (
                              {getLicenseUpdateTypeText(
                                item.purchase_subscribe_type.toString(),
                              )}
                              )
                            </span>
                          </div>
                          <div
                            className={styles.leftMiddle}
                          >
                            <span className={styles.key}>
                              {item.license_no}
                            </span>
                          </div>
                        </div>
                        <div className={styles.itemRight}>
                          <span className={styles.compDate}>
                            {formatDate(item.updated_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noData}>
                      구매 이력이 없습니다.
                    </div>
                  )}
                </div>
              </>
            )}
            {purchaseHistory?.data?.length > 0 && (
              <div className={styles.tablePageWrap}>
                <button
                  className={styles.pagePrev}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                ></button>
                <div className={styles.pageNumWrap}>
                  {[...Array(totalPages)].map(
                    (_, index) => (
                      <a
                        key={index + 1}
                        href=''
                        className={
                          currentPage === index + 1
                            ? styles.on
                            : ''
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                      >
                        {index + 1}
                      </a>
                    ),
                  )}
                </div>
                <button
                  className={styles.pageNext}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                ></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNicepayCancel && (
        <>
          <AlertModal
            isOpen={showNicepayCancel}
            onClose={() => setShowNicepayCancel(false)}
            title='거래 취소'
            buttons={[
              {
                variant: 'secondary',
                onClick: () => setShowNicepayCancel(false),
                label: '취소',
              },
              {
                variant: 'primary',
                onClick: () => {
                  handleNicepayCancel();
                },
                label: isProcessing ? '처리 중...' : '확인',
              },
            ]}
          />
        </>
      )}
    </section>
  );
};

export default License;
