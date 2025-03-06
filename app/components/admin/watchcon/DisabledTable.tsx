import { WatchConResponseDto } from '@/app/types/dto/watchCon/response.dto';
import { FC, useState } from 'react';
import styles from './style/Table.module.css';

const DisabledTable: FC<{
  data: WatchConResponseDto['DISABLED_LIST']['data']['list'];
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  const [sortConfig, setSortConfig] = useState(() => {
    const savedConfig = localStorage.getItem(
      'disabledTableSortConfig',
    );
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          column: 'num',
          isAscending: true,
          direction: 'asc',
        };
  });

  const handleSort = (column: string) => {
    const newConfig = {
      column,
      isAscending:
        sortConfig.column === column
          ? !sortConfig.isAscending
          : true,
      direction:
        sortConfig.column === column
          ? sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc'
          : 'asc',
    };
    setSortConfig(newConfig);
    localStorage.setItem(
      'disabledTableSortConfig',
      JSON.stringify(newConfig),
    );
  };

  const sortedData = [...data]
    .map((item, index) => ({
      ...item,
      originalIndex: index + 1,
    }))
    .sort((a, b) => {
      const isAsc = sortConfig.isAscending ? 1 : -1;

      switch (sortConfig.column) {
        case 'num':
          return (
            isAsc * (a.originalIndex - b.originalIndex)
          );
        case 'watchcon_id':
          return (
            isAsc *
            a.watchcon_id.localeCompare(b.watchcon_id)
          );
        case 'max_connection':
          return (
            isAsc *
            (Number(a.max_connection_count) -
              Number(b.max_connection_count))
          );
        case 'install_time':
          return (
            isAsc *
            (new Date(a.install_time).getTime() -
              new Date(b.install_time).getTime())
          );
        case 'using_days':
          return (
            isAsc *
            (Number(a.using_days) - Number(b.using_days))
          );
        case 'disable_time':
          return (
            isAsc *
            (new Date(a.disable_time).getTime() -
              new Date(b.disable_time).getTime())
          );
        default:
          return 0;
      }
    });

  const getSortIcon = (column: string) => {
    if (sortConfig.column === column) {
      return sortConfig.isAscending ? '▼' : '▲';
    }
    return '';
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th
            className={styles.num}
            onClick={() => handleSort('num')}
            style={{ cursor: 'pointer' }}
          >
            No <span>{getSortIcon('num')}</span>
          </th>
          <th
            onClick={() => handleSort('watchcon_id')}
            style={{ cursor: 'pointer' }}
          >
            WatchConID{' '}
            <span>{getSortIcon('watchcon_id')}</span>
          </th>
          <th
            onClick={() => handleSort('max_connection')}
            style={{ cursor: 'pointer' }}
          >
            Max Connection{' '}
            <span>{getSortIcon('max_connection')}</span>
          </th>
          <th
            onClick={() => handleSort('install_time')}
            style={{ cursor: 'pointer' }}
          >
            Installation Date{' '}
            <span>{getSortIcon('install_time')}</span>
          </th>
          <th
            onClick={() => handleSort('using_days')}
            style={{ cursor: 'pointer' }}
          >
            Using Date{' '}
            <span>{getSortIcon('using_days')}</span>
          </th>
          <th
            onClick={() => handleSort('disable_time')}
            style={{ cursor: 'pointer' }}
          >
            Disable Date{' '}
            <span>{getSortIcon('disable_time')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={7} className={styles.loading}>
              Loading...
            </td>
          </tr>
        ) : (
          sortedData.map((item) => (
            <tr key={item.originalIndex - 1}>
              <td>{item.originalIndex}</td>
              <td>{item.watchcon_id}</td>
              <td>{item.max_connection_count}</td>
              <td>{item.install_time.split(' ')[0]}</td>
              <td>{item.using_days}</td>
              <td>{item.disable_time.split(' ')[0]}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default DisabledTable;
