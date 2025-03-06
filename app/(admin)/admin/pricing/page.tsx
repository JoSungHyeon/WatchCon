'use client';

import { useEffect, useState } from 'react';
import FeatureTop from '../../..//components/admin/pricing/FeatureTop';
import DiscountTable from '../../../components/admin/pricing/DiscountTable';
import DiscountTop from '../../../components/admin/pricing/DiscountTop';
import FeatureLimit from '../../../components/admin/pricing/FeatureLimit';
import PriceTable from '../../../components/admin/pricing/PriceTable';
import PriceTop from '../../../components/admin/pricing/PriceTop';
import stylesB from '../../../components/admin/pricing/style/pricing.module.css';
import stylesA from '../../../components/admin/style/common.module.css';
import {
  AlertModal,
  DiscountModal,
  PriceModal,
  PricingFormData,
} from '../../../components/common/modals';
import AdminMenu from '../../../components/layout/AdminMenu';
import { usePricingMutation } from '../../../hooks/mutations/admin/pricing/usePricingMutation';
import { usePricingQuery } from '../../../hooks/queries/admin/pricing/usePricingQuery';
import { useModalStore } from '../../../store/modal.store';
import { usePricingStore } from '../../../store/pricing.store';

const PricingPage: React.FC = () => {
  const [list, setList] = useState('price');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFeaturePage, setCurrentFeaturePage] =
    useState(1);
  const [featureIndex, setFeatureIndex] = useState(0);
  const { priceId, setPriceId } = usePricingStore();
  const { ModalStates, toggleState } = useModalStore();
  const [adminId, setAdminId] = useState<string>('');

  const {
    data,
    totalPages,
    isLoading,
    discountData,
    latestPrice,
    featureLimitData,
    featureLimitTotal,
  } = usePricingQuery(currentPage);

  const {
    createPricing,
    deletePricing,
    updatePricing,
    deleteDiscount,
  } = usePricingMutation();

  const currentFeatureData = featureLimitData?.find(
    (item, index) => index === featureIndex,
  );

  useEffect(() => {
    const currentAdminId =
      sessionStorage.getItem('adminId') || '';
    setAdminId(currentAdminId);
  }, []);

  const handlePageChange = (pageNo: number) => {
    setCurrentPage(pageNo);
  };

  const handlePricingSubmit = (
    formData: PricingFormData,
    mode: 'new' | 'edit',
  ) => {
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const parseNumber = (value: string) => {
      return Number(value.replace(/,/g, ''));
    };

    const requestData = {
      basic_kw: parseNumber(formData.basic.monthly),
      premium_kw: parseNumber(formData.premium.monthly),
      business_kw: parseNumber(formData.business.monthly),
      basic_usd: parseNumber(formData.basic.yearly),
      premium_usd: parseNumber(formData.premium.yearly),
      business_usd: parseNumber(formData.business.yearly),
      notice_at: formatDate(formData.announcementDate),
      apply_at: formatDate(formData.effectiveDate),
      expired_at: formatDate(formData.expiredDate),
    };

    if (mode === 'edit') {
      updatePricing({
        price: { ...requestData, id: Number(priceId) },
      });
    } else {
      createPricing(requestData);
    }

    toggleState(`PRICING.${mode}`);
  };

  const handleDiscountPrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDiscountNextClick = () => {
    if (
      discountData &&
      currentPage <
        Math.ceil(
          discountData.total / discountData.page_size,
        )
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFeatureNextClick = () => {
    if (featureIndex < featureLimitTotal) {
      setFeatureIndex((prev) => prev + 1);
    }
  };

  const handleFeaturePrevClick = () => {
    if (featureIndex > 0) {
      setFeatureIndex((prev) => prev - 1);
    }
  };

  return (
    <div className={stylesA.container}>
      <AdminMenu />
      <section className={stylesA.section}>
        <div className={stylesB.sectionInner}>
          <div className={stylesB.sectionTop}>
            <button
              className={`${list === 'price' ? stylesB.on : ''}`}
              onClick={() => setList('price')}
            >
              Price List
            </button>
            <button
              className={`${list === 'discount' ? stylesB.on : ''}`}
              onClick={() => setList('discount')}
            >
              Discount List
            </button>
            <button
              className={`${list === 'feature' ? stylesB.on : ''}`}
              onClick={() => setList('feature')}
            >
              Feature Limit
            </button>
          </div>
          <div className={stylesB.sectionBottom}>
            {list === 'price' ? (
              <>
                <PriceTop />
                <PriceTable
                  data={data}
                  isLoading={isLoading}
                />
                <div className={stylesB.pagination}>
                  <button
                    className={stylesB.pagePrev}
                    onClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                  />
                  <div className={stylesB.pageNumWrap}>
                    {totalPages &&
                      Array.from(
                        { length: totalPages },
                        (_, index) => (
                          <a
                            key={index + 1}
                            href='#'
                            className={
                              currentPage === index + 1
                                ? stylesB.on
                                : ''
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(index + 1);
                            }}
                          >
                            {index + 1}
                          </a>
                        ),
                      )}
                  </div>
                  <button
                    className={stylesB.pageNext}
                    onClick={() =>
                      handlePageChange(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                  />
                </div>
              </>
            ) : list === 'discount' ? (
              <>
                <DiscountTop
                  data={discountData}
                  onPrevClick={handleDiscountPrevClick}
                  onNextClick={handleDiscountNextClick}
                  currentPage={currentPage}
                />
                <DiscountTable
                  discountData={discountData}
                  latestPrice={latestPrice}
                />
                <div className={stylesB.discountBtnWrap}>
                  <button
                    className={stylesB.write}
                    onClick={() =>
                      toggleState('PRICING.new_discount')
                    }
                  >
                    New Discount
                  </button>
                  <div
                    style={{ display: 'flex', gap: '12px' }}
                  >
                    <button
                      className={stylesB.edit}
                      onClick={() =>
                        toggleState(
                          'PRICING.delete_discount',
                        )
                      }
                    >
                      Delete
                    </button>
                    <button
                      className={stylesB.write}
                      onClick={() =>
                        toggleState('PRICING.edit_discount')
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </>
            ) : list === 'feature' ? (
              <>
                <FeatureTop
                  data={currentFeatureData}
                  onNextClick={handleFeatureNextClick}
                  onPrevClick={handleFeaturePrevClick}
                  featureIndex={featureIndex}
                  featureLimitTotal={featureLimitTotal}
                />
                <FeatureLimit data={currentFeatureData} />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {ModalStates.PRICING.alert && (
        <AlertModal
          isOpen={ModalStates.PRICING.alert}
          onClose={() => toggleState('PRICING.alert')}
          title='삭제 하시겠습니까?'
          buttons={[
            {
              label: '취소',
              onClick: () => toggleState('PRICING.alert'),
              variant: 'secondary',
            },
            {
              label: '확인',
              onClick: () => {
                deletePricing(priceId);
                toggleState('PRICING.alert');
                setPriceId('');
              },
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.PRICING.detail && (
        <PriceModal
          isOpen={ModalStates.PRICING.detail}
          onClose={() => toggleState('PRICING.detail')}
          mode='detail'
          onSubmit={(formData) =>
            handlePricingSubmit(formData, 'new')
          }
          buttons={[
            {
              label: 'close',
              onClick: () => toggleState('PRICING.detail'),
              variant: 'secondary',
            },
          ]}
        />
      )}

      {ModalStates.PRICING.new && (
        <PriceModal
          isOpen={ModalStates.PRICING.new}
          onClose={() => toggleState('PRICING.new')}
          mode='new'
          onSubmit={(formData) =>
            handlePricingSubmit(formData, 'new')
          }
          buttons={[
            {
              label: 'cancel',
              onClick: () => toggleState('PRICING.new'),
              variant: 'secondary',
            },
            {
              label: 'save',
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.PRICING.edit && (
        <PriceModal
          isOpen={ModalStates.PRICING.edit}
          onClose={() => toggleState('PRICING.edit')}
          mode='edit'
          onSubmit={(formData) =>
            handlePricingSubmit(formData, 'edit')
          }
          buttons={[
            {
              label: 'cancel',
              onClick: () => toggleState('PRICING.edit'),
              variant: 'secondary',
            },
            {
              label: 'save',
              onClick: () => {},
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.PRICING.new_discount && (
        <DiscountModal
          adminId={Number(adminId)}
          isOpen={ModalStates.PRICING.new_discount}
          onClose={() =>
            toggleState('PRICING.new_discount')
          }
          mode='new'
          buttons={[
            {
              label: 'cancel',
              onClick: () =>
                toggleState('PRICING.new_discount'),
              variant: 'secondary',
            },
            {
              label: 'save',
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.PRICING.edit_discount && (
        <DiscountModal
          adminId={Number(adminId)}
          isOpen={ModalStates.PRICING.edit_discount}
          onClose={() =>
            toggleState('PRICING.edit_discount')
          }
          mode='edit'
          discountData={discountData}
          buttons={[
            {
              label: 'cancel',
              onClick: () =>
                toggleState('PRICING.edit_discount'),
              variant: 'secondary',
            },
            {
              label: 'save',
              onClick: () => {
                // 모달 내부에서 onSubmit을 호출하도록 변경됨
                // handlePricingSubmit이 모달 내부의 form 데이터와 함께 호출됨
              },
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.PRICING.delete_discount && (
        <AlertModal
          isOpen={ModalStates.PRICING.delete_discount}
          onClose={() =>
            toggleState('PRICING.delete_discount')
          }
          title='삭제 하시겠습니까?'
          buttons={[
            {
              label: '취소',
              onClick: () =>
                toggleState('PRICING.delete_discount'),
              variant: 'secondary',
            },
            {
              label: '확인',
              onClick: async () => {
                try {
                  // discountData.list의 모든 항목의 id로 deleteDiscount 실행
                  await Promise.all(
                    discountData.list.map((item: any) =>
                      deleteDiscount(item.id.toString()),
                    ),
                  );
                  toggleState('PRICING.delete_discount');
                } catch (error) {
                  console.error(
                    '할인 삭제 중 오류 발생:',
                    error,
                  );
                }
              },
              variant: 'primary',
            },
          ]}
        />
      )}
    </div>
  );
};

export default PricingPage;
