import { usePricingStore } from '@/app/store/pricing.store';
import { PricingResponseDto } from '@/app/types/dto/pricing/response.dto';
import { FC } from 'react';
import styles from './style/DiscountTop.module.css';

interface DiscountTopProps {
  data?: PricingResponseDto['DISCOUNT_LIST']['GET']['data'];
  onPrevClick: () => void;
  onNextClick: () => void;
  currentPage: number;
}

const DiscountTop: FC<DiscountTopProps> = ({
  data,
  onPrevClick,
  onNextClick,
  currentPage,
}) => {
  const { DISCOUNT_LIST } = usePricingStore();

  const handleNextClick = () => {
    if (data?.list?.[0]?.apply_at) {
      const applyDate = new Date(data.list[0].apply_at);
      const expirationDate = new Date(applyDate);
      expirationDate.setDate(applyDate.getDate() - 1);
      DISCOUNT_LIST.setExpirationDate(
        expirationDate.toISOString().split('T')[0],
      );
    }
    onNextClick();
  };

  const handlePayUnitChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    DISCOUNT_LIST.setPayUnit(e.target.value);
  };

  const getExpirationDate = () => {
    if (currentPage === 1) {
      return '';
    }

    return DISCOUNT_LIST.expirationDate;
  };

  return (
    <>
      {/* <header
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <select
          className={styles.payUnit}
          onChange={handlePayUnitChange}
          value={DISCOUNT_LIST.payUnit}
        >
          <option value='kw'>KW</option>
          <option value='usd'>USD</option>
        </select>
      </header> */}
      <div className={styles.discountBottom}>
        <button
          className={styles.datePrev}
          onClick={onPrevClick}
          disabled={currentPage === 1}
        />
        <div className={styles.dateNumWrap}>
          <div>
            <p>공시일자</p>
            <input
              type='text'
              readOnly
              value={
                data?.list?.[0]?.notice_at?.split(' ')[0] ||
                ''
              }
              name='announcementDate'
              style={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <p>적용일자</p>
            <input
              type='text'
              readOnly
              value={
                data?.list?.[0]?.apply_at?.split(' ')[0] ||
                ''
              }
              name='effectiveDate'
              style={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <p>만기일자</p>
            <input
              type='text'
              readOnly
              value={
                data?.list?.[0]?.expired_at?.split(
                  ' ',
                )[0] || ''
              }
              name='expirationDate'
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>
        <button
          className={styles.dateNext}
          onClick={handleNextClick}
          disabled={
            !data ||
            currentPage >=
              Math.ceil(data.total / data.page_size)
          }
        />
      </div>
    </>
  );
};

export default DiscountTop;
