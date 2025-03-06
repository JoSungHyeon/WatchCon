'use client';

import { usePricingMutation } from '@/app/hooks/mutations/admin/pricing/usePricingMutation';
import { usePricingQuery } from '@/app/hooks/queries/admin/pricing/usePricingQuery';
import Image from 'next/image';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/DiscountModal.module.css';

interface ButtonConfig {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'new' | 'edit';
  buttons: ButtonConfig[];
  discountData?: any;
  adminId: number;
}

export const DiscountModal = ({
  isOpen,
  onClose,
  buttons,
  mode,
  discountData,
  adminId,
}: DiscountModalProps) => {
  if (!isOpen) return null;

  const { latestPrice, getPricingDiscounts } =
    usePricingQuery();
  const { createDiscount, updateDiscount } =
    usePricingMutation();

  const sortedData =
    discountData?.list?.sort(
      (a, b) => b.before_week - a.before_week,
    ) ?? [];

  const getInitialValue = (value: any) => {
    if (value === null || value === undefined) return '';
    return value.toString();
  };

  const initialFormData = {
    week4: {
      repurchase:
        mode === 'edit'
          ? getInitialValue(
              sortedData[0]?.repurchase_discount_rate,
            )
          : '',
      basic:
        mode === 'edit'
          ? getInitialValue(sortedData[0]?.basic)
          : '',
      premium:
        mode === 'edit'
          ? getInitialValue(sortedData[0]?.premium)
          : '',
      business:
        mode === 'edit'
          ? getInitialValue(sortedData[0]?.business)
          : '',
    },
    week3: {
      repurchase:
        mode === 'edit'
          ? getInitialValue(
              sortedData[1]?.repurchase_discount_rate,
            )
          : '',
      basic:
        mode === 'edit'
          ? getInitialValue(sortedData[1]?.basic)
          : '',
      premium:
        mode === 'edit'
          ? getInitialValue(sortedData[1]?.premium)
          : '',
      business:
        mode === 'edit'
          ? getInitialValue(sortedData[1]?.business)
          : '',
    },
    week2: {
      repurchase:
        mode === 'edit'
          ? getInitialValue(
              sortedData[2]?.repurchase_discount_rate,
            )
          : '',
      basic:
        mode === 'edit'
          ? getInitialValue(sortedData[2]?.basic)
          : '',
      premium:
        mode === 'edit'
          ? getInitialValue(sortedData[2]?.premium)
          : '',
      business:
        mode === 'edit'
          ? getInitialValue(sortedData[2]?.business)
          : '',
    },
    week1: {
      repurchase:
        mode === 'edit'
          ? getInitialValue(
              sortedData[3]?.repurchase_discount_rate,
            )
          : '',
      basic:
        mode === 'edit'
          ? getInitialValue(sortedData[3]?.basic)
          : '',
      premium:
        mode === 'edit'
          ? getInitialValue(sortedData[3]?.premium)
          : '',
      business:
        mode === 'edit'
          ? getInitialValue(sortedData[3]?.business)
          : '',
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedDate, setSelectedDate] = useState(
    mode === 'edit' && sortedData[0]?.notice_at
      ? new Date(sortedData[0].notice_at)
      : new Date(),
  );

  const handleInputChange = (
    week: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`week${week}`]: {
        ...prev[`week${week}`],
        [field]: value,
      },
    }));
  };

  // readOnly input의 value 계산을 위한 helper 함수 추가
  const calculateDiscountedPrice = (
    originalPrice?: number,
    discount?: string,
  ) => {
    if (!originalPrice || !discount)
      return originalPrice?.toLocaleString() ?? '';

    return Math.round(
      originalPrice * (1 - parseFloat(discount) / 100),
    ).toLocaleString();
  };

  const updateActiveDiscountsExpiredAt = async (
    expiredAt: string,
  ) => {
    const activeDiscounts = await getPricingDiscounts(
      discountData,
      'KW',
    );
    if (activeDiscounts?.length > 0) {
      return Promise.all(
        activeDiscounts.map((discount) =>
          updateDiscount({
            id: discount.id,
            admin_id: adminId,
            before_week: discount.before_week,
            repurchase_discount_rate:
              discount.repurchase_discount_rate,
            basic: discount.basic,
            premium: discount.premium,
            business: discount.business,
            notice_at: discount.notice_at,
            apply_at: discount.apply_at,
            expired_at: expiredAt,
          }),
        ),
      );
    }
    return Promise.resolve();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const applyAt = new Date(
      selectedDate.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    // 공통으로 사용할 할인 데이터 배열 생성
    const discountDataArray = [4, 3, 2, 1].map((week) => ({
      before_week: week,
      repurchase_discount_rate: formData[`week${week}`]
        .repurchase
        ? parseFloat(formData[`week${week}`].repurchase)
        : 0,
      basic: formData[`week${week}`].basic
        ? parseFloat(formData[`week${week}`].basic)
        : 0,
      premium: formData[`week${week}`].premium
        ? parseFloat(formData[`week${week}`].premium)
        : 0,
      business: formData[`week${week}`].business
        ? parseFloat(formData[`week${week}`].business)
        : 0,
      notice_at: selectedDate.toISOString(),
      apply_at: applyAt.toISOString(),
      expired_at: '', // 초기에는 만료일 없음
    }));

    try {
      if (mode === 'new') {
        // 기존 활성화된 할인 데이터가 있다면 만료일 설정
        const activeDiscounts = await getPricingDiscounts(
          discountData,
          'KW',
        ); // 활성화된 할인 데이터 조회 함수 필요
        if (activeDiscounts?.length > 0) {
          const expiredAt = new Date(applyAt);
          expiredAt.setDate(expiredAt.getDate() - 1);

          // 기존 활성화된 할인들의 만료일 업데이트
          await Promise.all(
            activeDiscounts.map((discount) =>
              updateDiscount({
                ...discount,
                expired_at: expiredAt.toISOString(),
              }),
            ),
          );
        }

        // 새로운 할인 생성
        await Promise.all(
          discountDataArray.map((data) =>
            createDiscount({
              ...data,
              admin_id: adminId,
            }),
          ),
        );
      } else {
        // 수정 시 변경된 데이터만 업데이트
        const changedData = discountDataArray.filter(
          (data, index) => {
            const original = sortedData[index];
            if (!original) return true;

            return (
              data.repurchase_discount_rate !==
                original.repurchase_discount_rate ||
              data.basic !== original.basic ||
              data.premium !== original.premium ||
              data.business !== original.business ||
              data.notice_at !== original.notice_at ||
              data.apply_at !== original.apply_at
            );
          },
        );

        if (changedData.length > 0) {
          // 기존 활성화된 다른 할인들의 만료일 업데이트
          const expiredAt = new Date(applyAt);
          expiredAt.setDate(expiredAt.getDate() - 1);

          await Promise.all([
            // 기존 활성화된 다른 할인들 만료일 설정
            updateActiveDiscountsExpiredAt(
              expiredAt.toISOString(),
            ),
            // 변경된 할인 데이터 업데이트
            ...changedData.map((data) =>
              updateDiscount({
                ...data,
                admin_id: adminId,
                id: sortedData.find(
                  (item) =>
                    item.before_week === data.before_week,
                )?.id,
              }),
            ),
          ]);
        }
      }
      onClose();
    } catch (error) {
      console.error(
        `할인 ${mode === 'new' ? '생성' : '업데이트'} 중 오류 발생:`,
        error,
      );
    }
  };

  return (
    <div className={styles.discountModalOverlay}>
      <div className={styles.discountModal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <Image
            src={x}
            alt='close'
            width={20}
            height={20}
          />
        </button>

        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>
            {mode === 'new'
              ? 'New Discount'
              : 'Edit Discount'}
          </h2>
          <div className={styles.modalBody}>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.inputBasic}>
                <div>
                  <div className={styles.title}>
                    <p>4주전</p>
                  </div>
                  <div className={styles.inputWrap}>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week4.repurchase}
                        onChange={(e) =>
                          handleInputChange(
                            4,
                            'repurchase',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week4.basic ?? ''}
                        onChange={(e) =>
                          handleInputChange(
                            4,
                            'basic',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={calculateDiscountedPrice(
                          latestPrice?.KW?.basic_kw,
                          formData.week4.basic,
                        )}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week4.premium}
                        onChange={(e) =>
                          handleInputChange(
                            4,
                            'premium',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week4.premium
                            ? Math.round(
                                latestPrice?.KW.premium_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week4
                                        .premium,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.premium_kw.toLocaleString()
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week4.business}
                        onChange={(e) =>
                          handleInputChange(
                            4,
                            'business',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week4.business
                            ? Math.round(
                                latestPrice?.KW
                                  .business_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week4
                                        .business,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.business_kw.toLocaleString()
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.title}>
                    <p>3주전</p>
                  </div>
                  <div className={styles.inputWrap}>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week3.repurchase}
                        onChange={(e) =>
                          handleInputChange(
                            3,
                            'repurchase',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week3.basic ?? ''}
                        onChange={(e) =>
                          handleInputChange(
                            3,
                            'basic',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={calculateDiscountedPrice(
                          latestPrice?.KW?.basic_kw,
                          formData.week3.basic,
                        )}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week3.premium}
                        onChange={(e) =>
                          handleInputChange(
                            3,
                            'premium',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week3.premium
                            ? Math.round(
                                latestPrice?.KW.premium_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week3
                                        .premium,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.premium_kw.toLocaleString()
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week3.business}
                        onChange={(e) =>
                          handleInputChange(
                            3,
                            'business',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week3.business
                            ? Math.round(
                                latestPrice?.KW
                                  .business_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week3
                                        .business,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.business_kw.toLocaleString()
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.title}>
                    <p>2주전</p>
                  </div>
                  <div className={styles.inputWrap}>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week2.repurchase}
                        onChange={(e) =>
                          handleInputChange(
                            2,
                            'repurchase',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week2.basic ?? ''}
                        onChange={(e) =>
                          handleInputChange(
                            2,
                            'basic',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={calculateDiscountedPrice(
                          latestPrice?.KW?.basic_kw,
                          formData.week2.basic,
                        )}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week2.premium}
                        onChange={(e) =>
                          handleInputChange(
                            2,
                            'premium',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week2.premium
                            ? Math.round(
                                latestPrice?.KW.premium_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week2
                                        .premium,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.premium_kw.toLocaleString()
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week2.business}
                        onChange={(e) =>
                          handleInputChange(
                            2,
                            'business',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week2.business
                            ? Math.round(
                                latestPrice?.KW
                                  .business_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week2
                                        .business,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.business_kw.toLocaleString()
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.title}>
                    <p>1주전</p>
                  </div>
                  <div className={styles.inputWrap}>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week1.repurchase}
                        onChange={(e) =>
                          handleInputChange(
                            1,
                            'repurchase',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week1.basic ?? ''}
                        onChange={(e) =>
                          handleInputChange(
                            1,
                            'basic',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={calculateDiscountedPrice(
                          latestPrice?.KW?.basic_kw,
                          formData.week1.basic,
                        )}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week1.premium}
                        onChange={(e) =>
                          handleInputChange(
                            1,
                            'premium',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week1.premium
                            ? Math.round(
                                latestPrice?.KW.premium_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week1
                                        .premium,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.premium_kw.toLocaleString()
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.week1.business}
                        onChange={(e) =>
                          handleInputChange(
                            1,
                            'business',
                            e.target.value,
                          )
                        }
                        placeholder='%'
                      />
                      <input
                        type='text'
                        readOnly
                        value={
                          formData.week1.business
                            ? Math.round(
                                latestPrice?.KW
                                  .business_kw *
                                  (1 -
                                    parseFloat(
                                      formData.week1
                                        .business,
                                    ) /
                                      100),
                              ).toLocaleString()
                            : latestPrice?.KW.business_kw.toLocaleString()
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p>공시 30일 후 적용</p>
              <div className={styles.dateWrap}>
                <p>공시일자</p>
                <div className={styles.calenderWrapper}>
                  <div className={styles.calenderWrap}>
                    <DatePicker
                      className={styles.datepickerInput}
                      selected={selectedDate}
                      onChange={(date: Date) =>
                        setSelectedDate(date)
                      }
                      dateFormat='yyyy / MM / dd'
                      minDate={new Date()}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.effectiveDate}>
                <p>적용일자</p>
                <div className={styles.inputWrap}>
                  <input
                    type='text'
                    readOnly
                    value={new Date(
                      selectedDate.getTime() +
                        30 * 24 * 60 * 60 * 1000,
                    )
                      .toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                      .replace(/\. /g, ' / ')
                      .replace('.', '')}
                  />
                </div>
              </div>
              <div className={styles.modalBottom}>
                <div className={styles.buttonContainer}>
                  {buttons.map((button, index) => (
                    <button
                      key={index}
                      type={
                        button.label.toLowerCase() ===
                        'save'
                          ? 'submit'
                          : 'button'
                      }
                      onClick={
                        button.label.toLowerCase() ===
                        'save'
                          ? undefined
                          : button.onClick
                      }
                      className={`${styles.modalButton} ${
                        button.variant === 'secondary'
                          ? styles.secondary
                          : styles.primary
                      }`}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
