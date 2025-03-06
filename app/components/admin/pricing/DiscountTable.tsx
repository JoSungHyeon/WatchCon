import { usePricingStore } from '@/app/store/pricing.store';
import { PricingResponseDto } from '@/app/types/dto/pricing/response.dto';
import { FC } from 'react';
import styles from './style/Table.module.css';

interface DiscountTableProps {
  discountData?: PricingResponseDto['DISCOUNT_LIST']['GET']['data'];
  latestPrice?: {
    KW: {
      basic_kw: number;
      premium_kw: number;
      business_kw: number;
    };
    USD: {
      basic_usd: number;
      premium_usd: number;
      business_usd: number;
    };
  };
  currentDiscountId?: number;
}

const DiscountTable: FC<DiscountTableProps> = ({
  discountData,
  latestPrice,
  currentDiscountId,
}) => {
  const { DISCOUNT_LIST } = usePricingStore();

  const sortedData = discountData?.list.sort(
    (a, b) => b.before_week - a.before_week,
  );

  const calculateDiscountedPrice = (
    price: number,
    discountRate: number,
  ) => {
    return Math.round(price * (1 - discountRate / 100));
  };

  const isEditDisabled = (item: any) => {
    const today = new Date();
    const expiryDate = item.expiry_date
      ? new Date(item.expiry_date)
      : null;

    return (
      (expiryDate && today > expiryDate) ||
      item.id === currentDiscountId
    );
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Early Birds</th>
          <th>연속사용 (1년 이상)</th>
          <th>Lite</th>
          <th>Premium</th>
          <th>Business</th>
        </tr>
      </thead>
      <tbody>
        {sortedData?.map((item) => (
          <tr
            key={item.id}
            className={
              isEditDisabled(item) ? styles.disabled : ''
            }
          >
            <td>{item.before_week}주전</td>
            <td>{item.repurchase_discount_rate}% </td>
            <td>
              {item.basic}% (
              {DISCOUNT_LIST.payUnit === 'kw'
                ? calculateDiscountedPrice(
                    latestPrice?.KW.basic_kw || 0,
                    item.basic,
                  ).toLocaleString()
                : calculateDiscountedPrice(
                    latestPrice?.USD.basic_usd || 0,
                    item.basic,
                  ).toLocaleString()}
              )
            </td>
            <td>
              {item.premium}% (
              {DISCOUNT_LIST.payUnit === 'kw'
                ? calculateDiscountedPrice(
                    latestPrice?.KW.premium_kw || 0,
                    item.premium,
                  ).toLocaleString()
                : calculateDiscountedPrice(
                    latestPrice?.USD.premium_usd || 0,
                    item.premium,
                  ).toLocaleString()}
              )
            </td>
            <td>
              {item.business}% (
              {DISCOUNT_LIST.payUnit === 'kw'
                ? calculateDiscountedPrice(
                    latestPrice?.KW.business_kw || 0,
                    item.business,
                  ).toLocaleString()
                : calculateDiscountedPrice(
                    latestPrice?.USD.business_usd || 0,
                    item.business,
                  ).toLocaleString()}
              )
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DiscountTable;
