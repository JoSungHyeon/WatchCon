import { FC } from 'react';
import styles from './style/Table.module.css';

interface WatchConData {
  data?: any;
  isLoading?: boolean;
  sortConfig: {
    key: string;
    direction: string;
  };
  onSortChange: (newSortConfig: {
    key: string;
    direction: string;
  }) => void;
}

const TotalTable: FC<WatchConData> = ({
  data,
  isLoading,
  sortConfig,
  onSortChange,
}) => {
  if (isLoading) return <div>Loading...</div>;
  if (!data?.length) return <div>데이터가 없습니다.</div>;

  const sortedData = [...data]
    .map((item, index) => ({
      ...item,
      originalIndex: index + 1,
    }))
    .sort((a, b) => {
      if (sortConfig.key === 'no') {
        return sortConfig.direction === 'asc'
          ? a.originalIndex - b.originalIndex
          : b.originalIndex - a.originalIndex;
      }

      let aValue =
        sortConfig.key === 'login_status'
          ? a.login_status > 0
            ? 'Pay'
            : 'Free'
          : sortConfig.key === 'install_time'
            ? a.install_time.split(' ')[0]
            : a[sortConfig.key];
      let bValue =
        sortConfig.key === 'login_status'
          ? b.login_status > 0
            ? 'Pay'
            : 'Free'
          : sortConfig.key === 'install_time'
            ? b.install_time.split(' ')[0]
            : b[sortConfig.key];

      if (aValue < bValue)
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    onSortChange({
      key,
      direction:
        sortConfig.key === key &&
        sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th
            className={styles.num}
            onClick={() => handleSort('no')}
            style={{ cursor: 'pointer' }}
          >
            No{' '}
            <span>
              {sortConfig.key === 'no'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('login_status')}
            style={{ cursor: 'pointer' }}
          >
            Free / Pay{' '}
            <span>
              {sortConfig.key === 'login_status'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('watchcon_id')}
            style={{ cursor: 'pointer' }}
          >
            WatchConID{' '}
            <span>
              {sortConfig.key === 'watchcon_id'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() =>
              handleSort('max_connection_count')
            }
            style={{ cursor: 'pointer' }}
          >
            Max Connection{' '}
            <span>
              {sortConfig.key === 'max_connection_count'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('install_time')}
            style={{ cursor: 'pointer' }}
          >
            Install Date{' '}
            <span>
              {sortConfig.key === 'install_time'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('using_day')}
            style={{ cursor: 'pointer' }}
          >
            Using Day{' '}
            <span>
              {sortConfig.key === 'using_day'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => (
          <tr key={item.originalIndex}>
            <td>{item.originalIndex}</td>
            <td>
              {item.login_status > 0 ? 'Pay' : 'Free'}
            </td>
            <td className={styles.watchConId}>
              {item.watchcon_id}
            </td>
            <td>{item.max_connection_count}</td>
            <td>{item.install_time.split(' ')[0]}</td>
            <td>{item.using_day}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TotalTable;
