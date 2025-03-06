import { useUserTableStore } from '@/app/store/userTableStore';
import { UserResponseDto } from '@/app/types/dto/user/response.dto';
import { FC } from 'react';
import styles from './style/Table.module.css';

interface UserTableProps {
  data:
    | UserResponseDto['USER_LIST']['data']['list']
    | undefined;
  isLoading: boolean;
}

const UserTable: FC<UserTableProps> = ({
  data = [],
  isLoading,
}) => {
  const { sortConfig, setSortConfig } = useUserTableStore();

  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortConfig.isAscending ? 1 : -1;

    switch (sortConfig.column) {
      case 'username':
        return (
          a.username.localeCompare(b.username) * multiplier
        );
      case 'license_type':
        return (
          a.license_type.localeCompare(b.license_type) *
          multiplier
        );
      case 'published_time':
        return (
          (new Date(a.published_time).getTime() -
            new Date(b.published_time).getTime()) *
          multiplier
        );
      case 'connection_count':
        return (
          (Number(a.connection_count) -
            Number(b.connection_count)) *
          multiplier
        );
      case 'updated_at':
        return (
          (new Date(a.updated_at).getTime() -
            new Date(b.updated_at).getTime()) *
          multiplier
        );
      case 'license_expired_time':
        return (
          (new Date(a.license_expired_time).getTime() -
            new Date(b.license_expired_time).getTime()) *
          multiplier
        );
      default:
        return 0;
    }
  });

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th
            className={styles.num}
            onClick={() => setSortConfig('username')}
            style={{ cursor: 'pointer' }}
          >
            UserID{' '}
            <span>
              {sortConfig.column === 'username'
                ? sortConfig.isAscending
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => setSortConfig('license_type')}
            style={{ cursor: 'pointer' }}
          >
            License Type{' '}
            <span>
              {sortConfig.column === 'license_type'
                ? sortConfig.isAscending
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => setSortConfig('published_time')}
            style={{ cursor: 'pointer' }}
          >
            Register Date{' '}
            <span>
              {sortConfig.column === 'published_time'
                ? sortConfig.isAscending
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() =>
              setSortConfig('connection_count')
            }
            style={{ cursor: 'pointer' }}
          >
            Connection Count{' '}
            <span>
              {sortConfig.column === 'connection_count'
                ? sortConfig.isAscending
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => setSortConfig('updated_at')}
            style={{ cursor: 'pointer' }}
          >
            Last Connections{' '}
            <span>
              {sortConfig.column === 'updated_at'
                ? sortConfig.isAscending
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() =>
              setSortConfig('license_expired_time')
            }
            style={{ cursor: 'pointer' }}
          >
            Expire License Date{' '}
            <span>
              {sortConfig.column === 'license_expired_time'
                ? sortConfig.isAscending
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {!data ? (
          <tr>
            <td colSpan={6} className={styles.noData}>
              데이터가 없습니다.
            </td>
          </tr>
        ) : (
          sortedData.map(
            (
              user: UserResponseDto['USER_LIST']['data']['list'][number],
              index: number,
            ) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.license_type}</td>
                <td>{user.published_time.split(' ')[0]}</td>
                <td>{user.connection_count}</td>
                <td>{user.updated_at.split(' ')[0]}</td>
                <td>
                  {user.license_expired_time.split(' ')[0]}
                </td>
              </tr>
            ),
          )
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
