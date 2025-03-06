import { useModalStore } from '@/app/store/modal.store';
import { useWatchconStore } from '@/app/store/watchcon.store';
import { WatchConResponseDto } from '@/app/types/dto/watchCon/response.dto';
import { FC } from 'react';
import styles from './style/Table.module.css';

const BlackTable: FC<{
  data: WatchConResponseDto['BLACK_LIST']['data']['list'];
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  const { toggleState } = useModalStore();
  const {
    setDisabledId,
    sortField,
    isAscending,
    setSortField,
    setIsAscending,
  } = useWatchconStore();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setIsAscending(!isAscending);
    } else {
      setSortField(field);
      setIsAscending(true);
    }
  };

  const sortedData = [...data]
    .map((item, index) => ({
      ...item,
      originalIndex: index + 1,
    }))
    .sort((a, b) => {
      const multiplier = isAscending ? 1 : -1;

      switch (sortField) {
        case 'no':
          return (
            multiplier * (a.originalIndex - b.originalIndex)
          );
        case 'watchcon_id':
          return (
            multiplier *
            a.watchcon_id.localeCompare(b.watchcon_id)
          );
        case 'max_connection':
          return (
            multiplier *
            (Number(a.max_connection_count) -
              Number(b.max_connection_count))
          );
        case 'install_date':
          return (
            multiplier *
            a.install_time.localeCompare(b.install_time)
          );
        case 'using_days':
          return (
            multiplier *
            (Number(a.using_days) - Number(b.using_days))
          );
        default:
          return 0;
      }
    });

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return isAscending ? '▼' : '▲';
    }
    return '';
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
            No <span>{getSortIcon('no')}</span>
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
            onClick={() => handleSort('install_date')}
            style={{ cursor: 'pointer' }}
          >
            Installation Date{' '}
            <span>{getSortIcon('install_date')}</span>
          </th>
          <th
            onClick={() => handleSort('using_days')}
            style={{ cursor: 'pointer' }}
          >
            Using Date{' '}
            <span>{getSortIcon('using_days')}</span>
          </th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={6} className={styles.loading}>
              Loading...
            </td>
          </tr>
        ) : (
          sortedData.map((item) => (
            <tr key={item.watchcon_id}>
              <td>{item.originalIndex}</td>
              <td className={styles.watchConId}>
                {item.watchcon_id}
              </td>
              <td>{item.max_connection_count}</td>
              <td>{item.install_time.split(' ')[0]}</td>
              <td>{item.using_days}</td>
              <td>
                <button
                  onClick={() => {
                    setDisabledId(item.watchcon_id);
                    toggleState('WATCHCON.disable');
                  }}
                >
                  Disable
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default BlackTable;
