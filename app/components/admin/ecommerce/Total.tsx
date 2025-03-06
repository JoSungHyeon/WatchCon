import {
  useTotalConnectionQuery,
  useTotalDownloadQuery,
  useTotalSalesQuery,
  useTotalUserQuery,
} from '@/app/hooks/queries/admin/ecommerce/useEcommerceQuery';
import { useState } from 'react';
import styles from './style/Total.module.css';
import Type from './Type';

interface TotalItem {
  text: string;
  count: string;
  percent: string;
  status: 'up' | '' | 'down';
}

interface TotalConnection {
  totalConnection?: number;
}

const Total: React.FC<TotalConnection> = () => {
  const [selectedType, setSelectedType] =
    useState<number>(3);

  const { data: totalConnection } = useTotalConnectionQuery(
    Number.isInteger(selectedType) ? selectedType : 3,
  );
  const { data: totalSales } = useTotalSalesQuery(
    Number.isInteger(selectedType) ? selectedType : 3,
  );
  const { data: totalDownload } = useTotalDownloadQuery(
    Number.isInteger(selectedType) ? selectedType : 3,
  );
  const { data: totalUser } = useTotalUserQuery(
    Number.isInteger(selectedType) ? selectedType : 3,
  );

  const handleTypeChange = (type: string) => {
    switch (type) {
      case 'Month':
        setSelectedType(3);
        break;
      case 'Week':
        setSelectedType(1);
        break;
      case 'Day':
        setSelectedType(0);
        break;
      default:
        setSelectedType(3);
    }
  };

  const totalData: TotalItem[] = [
    {
      text: 'Total Connection',
      count: totalConnection?.data?.total
        ? String(totalConnection.data.total)
        : '0',
      percent: totalConnection?.data?.rate
        ? `${totalConnection.data.rate.toFixed(1)}%`
        : '0%',
      status:
        Math.abs(totalConnection?.data?.rate ?? 0) < 0.1
          ? ''
          : (totalConnection?.data?.rate ?? 0) >= 0
            ? 'up'
            : 'down',
    },
    {
      text: 'Total Sales',
      count: totalSales?.data?.total
        ? String(totalSales.data.total)
        : '0',
      percent: `${totalSales?.data?.rate?.toFixed(1)}%`,
      status:
        Math.abs(totalSales?.data?.rate ?? 0) < 0.1
          ? ''
          : (totalSales?.data?.rate ?? 0) >= 0
            ? 'up'
            : 'down',
    },
    {
      text: 'Total Download',
      count: totalDownload?.data?.total
        ? String(totalDownload.data.total)
        : '0',
      percent: `${totalDownload?.data?.rate?.toFixed(1)}%`,
      status:
        Math.abs(totalDownload?.data?.rate ?? 0) < 0.1
          ? ''
          : (totalDownload?.data?.rate ?? 0) >= 0
            ? 'up'
            : 'down',
    },
    {
      text: 'Total Users',
      count: totalUser?.data?.total
        ? String(totalUser.data.total)
        : '0',
      percent: `${totalUser?.data?.rate?.toFixed(1)}%`,
      status:
        Math.abs(totalUser?.data?.rate ?? 0) < 0.1
          ? ''
          : (totalUser?.data?.rate ?? 0) >= 0
            ? 'up'
            : 'down',
    },
  ];

  return (
    <div className={styles.totalWrapper}>
      <Type
        types={['Month', 'Week', 'Day']}
        defaultType='Month'
        onTypeChange={(type) => {
          handleTypeChange(type);
        }}
      />
      <div className={styles.totalItemWrap}>
        {totalData.map((item: TotalItem, i: number) => (
          <div className={styles.totalItem} key={i}>
            <div className={styles.itemTop}>
              <img
                src={`/img/admin/ecommerce/icon_${i + 1}.png`}
                alt={`icon${i + 1}`}
              />
            </div>
            <div className={styles.itemMiddle}>
              <p>{item.text}</p>
            </div>
            <div className={styles.itemBottom}>
              <strong>{item.count}</strong>
              <span className={styles[item.status]}>
                {item.percent}
                <i></i>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Total;
