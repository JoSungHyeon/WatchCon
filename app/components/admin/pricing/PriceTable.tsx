import { usePricingStore } from '@/app/store/pricing.store';
import { PricingResponseDto } from '@/app/types/dto/pricing/response.dto';
import { FC, useState } from 'react';
import { useModalStore } from '../../../store/modal.store';
import styles from './style/Table.module.css';

interface PriceTableProps {
  data?: PricingResponseDto['GET']['data'];
  isLoading: boolean;
}

const PriceTable: FC<PriceTableProps> = ({
  data,
  isLoading,
}) => {
  const { payUnit, setPriceId } = usePricingStore();
  const [isAscending, setIsAscending] = useState(true);

  const { toggleState } = useModalStore();

  // Add number formatting function
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (!data?.list.length)
    return <div>데이터가 없습니다.</div>;

  const sortedData = [...data.list].sort((a, b) => {
    return isAscending ? 1 : -1;
  });

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th
            className={styles.num}
            onClick={() => setIsAscending(!isAscending)}
            style={{ cursor: 'pointer' }}
          >
            No <span>{isAscending ? '▼' : '▲'}</span>
          </th>
          <th>Lite Price</th>
          <th>Premium Price</th>
          <th>Business Price</th>
          <th>공시 일자</th>
          <th>적용일자</th>
          <th>만기일자</th>
          <th>편집</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(
          (
            item: PricingResponseDto['GET']['data']['list'][0],
            index: number,
            array: PricingResponseDto['GET']['data']['list'],
          ) => {
            const today = new Date();
            const applyDate = new Date(item.apply_at);
            const expiryDate =
              index === 0
                ? null
                : new Date(array[index - 1].apply_at);

            const isCurrentlyActive =
              applyDate <= today &&
              (!expiryDate || expiryDate > today);
            const isExpired =
              expiryDate && expiryDate <= today;

            return (
              <tr key={item.id}>
                <td>
                  {isAscending
                    ? index + 1
                    : data?.list.length - index}
                </td>
                <td>
                  {payUnit === 'kw'
                    ? formatNumber(item.basic_kw)
                    : formatNumber(item.basic_usd)}
                </td>
                <td>
                  {payUnit === 'kw'
                    ? formatNumber(item.premium_kw)
                    : formatNumber(item.premium_usd)}
                </td>
                <td>
                  {payUnit === 'kw'
                    ? formatNumber(item.business_kw)
                    : formatNumber(item.business_usd)}
                </td>
                <td>{item.notice_at.split(' ')[0]}</td>
                <td>{item.apply_at.split(' ')[0]}</td>
                <td>
                  {index === 0
                    ? ''
                    : new Date(array[index - 1].apply_at)
                        .toISOString()
                        .split('T')[0]}
                </td>
                <td>
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'delete') {
                        setPriceId(item.id);
                        toggleState('PRICING.alert');
                        e.target.value = ''; // Reset select after deletion
                      }
                      if (e.target.value === 'edit') {
                        setPriceId(item.id);
                        toggleState('PRICING.edit');
                        e.target.value = '';
                      }
                      if (e.target.value === 'detail') {
                        setPriceId(item.id);
                        toggleState('PRICING.detail');
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value=''>Action</option>
                    <option
                      value='delete'
                      disabled={
                        isCurrentlyActive || isExpired
                      }
                    >
                      Delete
                    </option>
                    <option
                      value='edit'
                      disabled={
                        isCurrentlyActive || isExpired
                      }
                    >
                      Edit
                    </option>
                    <option value='detail'>Detail</option>
                  </select>
                </td>
              </tr>
            );
          },
        )}
      </tbody>
    </table>
  );
};

export default PriceTable;
