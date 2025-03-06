'use client';

import { usePricingQuery } from '@/app/hooks/queries/admin/pricing/usePricingQuery';
import { usePricingStore } from '@/app/store/pricing.store';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/PriceModal.module.css';

export interface PricingFormData {
  basic: {
    monthly: string;
    yearly: string;
  };
  premium: {
    monthly: string;
    yearly: string;
  };
  business: {
    monthly: string;
    yearly: string;
  };
  announcementDate: Date;
  effectiveDate: Date;
  expiredDate: Date;
}

interface ButtonConfig {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface PriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'new' | 'edit' | 'detail';
  buttons: ButtonConfig[];
  onSubmit: (data: PricingFormData) => void;
}

export const PriceModal = ({
  isOpen,
  onClose,
  buttons,
  mode,
  onSubmit,
}: PriceModalProps) => {
  const [formData, setFormData] = useState<PricingFormData>(
    {
      basic: { monthly: '', yearly: '' },
      premium: { monthly: '', yearly: '' },
      business: { monthly: '', yearly: '' },
      announcementDate: new Date(),
      effectiveDate: new Date(
        new Date().setDate(new Date().getDate() + 30),
      ),
      expiredDate: new Date(
        new Date().setDate(new Date().getDate() + 29),
      ),
    },
  );

  const { priceId } = usePricingStore();
  const { detailData } = usePricingQuery(
    undefined,
    priceId,
  );

  const formatNumberWithCommas = (
    value: string,
  ): string => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (
    plan: 'basic' | 'premium' | 'business',
    type: 'monthly' | 'yearly',
    value: string,
  ) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const formattedValue =
      formatNumberWithCommas(numericValue);

    setFormData((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [type]: formattedValue },
    }));
  };

  const handleDateChange = (date: Date) => {
    const effectiveDate = new Date(date);
    effectiveDate.setDate(date.getDate() + 30);

    const expiredDate = new Date(effectiveDate);
    expiredDate.setDate(effectiveDate.getDate() - 1);

    setFormData((prev) => ({
      ...prev,
      announcementDate: date,
      effectiveDate: effectiveDate,
      expiredDate: expiredDate,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 콤마 제거 후 숫자로 변환하여 새로운 formData 생성
    const processedFormData = {
      ...formData,
      basic: {
        monthly: formData.basic.monthly.replace(/,/g, ''),
        yearly: formData.basic.yearly.replace(/,/g, ''),
      },
      premium: {
        monthly: formData.premium.monthly.replace(/,/g, ''),
        yearly: formData.premium.yearly.replace(/,/g, ''),
      },
      business: {
        monthly: formData.business.monthly.replace(
          /,/g,
          '',
        ),
        yearly: formData.business.yearly.replace(/,/g, ''),
      },
    };

    if (mode === 'edit') {
      console.log(
        'Edit Mode Form Data:',
        processedFormData,
      );
    }
    onSubmit(processedFormData);
  };

  useEffect(() => {
    if (
      (mode === 'detail' || mode === 'edit') &&
      detailData
    ) {
      setFormData({
        basic: {
          monthly: formatNumberWithCommas(
            String(detailData.basic_kw),
          ),
          yearly: formatNumberWithCommas(
            String(detailData.basic_usd),
          ),
        },
        premium: {
          monthly: formatNumberWithCommas(
            String(detailData.premium_kw),
          ),
          yearly: formatNumberWithCommas(
            String(detailData.premium_usd),
          ),
        },
        business: {
          monthly: formatNumberWithCommas(
            String(detailData.business_kw),
          ),
          yearly: formatNumberWithCommas(
            String(detailData.business_usd),
          ),
        },
        announcementDate: new Date(detailData.notice_at),
        effectiveDate: new Date(detailData.apply_at),
        expiredDate: new Date(detailData.expired_at),
      });
    }
  }, [detailData, mode]);

  if (!isOpen) return null;

  return (
    <div className={styles.priceModalOverlay}>
      <div className={styles.priceModal}>
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
              ? 'New Price'
              : mode === 'detail'
                ? 'Detail Price'
                : 'Edit Price'}
          </h2>
          <div className={styles.modalBody}>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              noValidate
            >
              <div className={styles.inputBasic}>
                <div className={styles.basicWrap}>
                  <p>Lite</p>
                  <div className={styles.inputWrap}>
                    <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.basic.monthly}
                        onChange={(e) =>
                          handleInputChange(
                            'basic',
                            'monthly',
                            e.target.value,
                          )
                        }
                        placeholder='Monthly'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        readOnly={mode === 'detail'}
                        className={
                          mode === 'detail'
                            ? styles.readOnlyInput
                            : ''
                        }
                      />
                    </div>
                    {/* <div className={styles.inputContainer}>
                      <input
                        type='text'
                        value={formData.basic.yearly}
                        onChange={(e) =>
                          handleInputChange(
                            'basic',
                            'yearly',
                            e.target.value,
                          )
                        }
                        placeholder='Yearly (USD)'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        readOnly={mode === 'detail'}
                        className={
                          mode === 'detail'
                            ? styles.readOnlyInput
                            : ''
                        }
                      />
                    </div> */}
                  </div>
                </div>
                <div className={styles.premiumWrap}>
                  <p>Premium</p>
                  <div className={styles.inputWrap}>
                    <input
                      type='text'
                      value={formData.premium.monthly}
                      onChange={(e) =>
                        handleInputChange(
                          'premium',
                          'monthly',
                          e.target.value,
                        )
                      }
                      placeholder='Monthly (KRW)'
                      inputMode='numeric'
                      pattern='[0-9,]*'
                      readOnly={mode === 'detail'}
                      className={
                        mode === 'detail'
                          ? styles.readOnlyInput
                          : ''
                      }
                    />
                    {/* <input
                      type='text'
                      value={formData.premium.yearly}
                      onChange={(e) =>
                        handleInputChange(
                          'premium',
                          'yearly',
                          e.target.value,
                        )
                      }
                      placeholder='Yearly (USD)'
                      inputMode='numeric'
                      pattern='[0-9,]*'
                      readOnly={mode === 'detail'}
                      className={
                        mode === 'detail'
                          ? styles.readOnlyInput
                          : ''
                      }
                    /> */}
                  </div>
                </div>
                <div className={styles.BusinessWrap}>
                  <p>Business</p>
                  <div className={styles.inputWrap}>
                    <input
                      type='text'
                      value={formData.business.monthly}
                      onChange={(e) =>
                        handleInputChange(
                          'business',
                          'monthly',
                          e.target.value,
                        )
                      }
                      placeholder='Monthly (KRW)'
                      inputMode='numeric'
                      pattern='[0-9,]*'
                      readOnly={mode === 'detail'}
                      className={
                        mode === 'detail'
                          ? styles.readOnlyInput
                          : ''
                      }
                    />
                    {/* <input
                      type='text'
                      value={formData.business.yearly}
                      onChange={(e) =>
                        handleInputChange(
                          'business',
                          'yearly',
                          e.target.value,
                        )
                      }
                      placeholder='Yearly (USD)'
                      inputMode='numeric'
                      pattern='[0-9,]*'
                      readOnly={mode === 'detail'}
                      className={
                        mode === 'detail'
                          ? styles.readOnlyInput
                          : ''
                      }
                    /> */}
                  </div>
                </div>
              </div>
              <p>공시 30일 후 적용</p>
              <div className={styles.dateWrap}>
                <p>공시일자</p>
                <div className={styles.calenderWrapper}>
                  <div className={styles.calenderWrap}>
                    <DatePicker
                      selected={formData.announcementDate}
                      onChange={handleDateChange}
                      dateFormat='yyyy / MM / dd'
                      className={styles.datepickerInput}
                      minDate={
                        new Date(
                          new Date().setDate(
                            new Date().getDate() + 1,
                          ),
                        )
                      }
                      disabled={mode === 'detail'}
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
                    value={formData.effectiveDate
                      .toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        formatMatcher: 'basic',
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
