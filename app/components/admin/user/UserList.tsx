import { UserResponseDto } from '@/app/types/dto/user/response.dto';
import { useState } from 'react';
import styles from './style/UserList.module.css';
import UserTable from './UserTable';

interface UserListProps {
  data: UserResponseDto['USER_LIST']['data']['list'];
  isLoading: boolean;
  onPageSizeChange: (newSize: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  total: number;
  pageSize: number;
}

const UserList: React.FC<UserListProps> = ({
  data,
  isLoading,
  onPageSizeChange,
  currentPage,
  onPageChange,
  total,
  pageSize,
}) => {
  const [searchText, setSearchText] = useState('');
  const [tempPageSize, setTempPageSize] =
    useState(pageSize);

  const filteredData = data?.filter(
    (user) =>
      user.username
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      user.license_type
        .toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  const totalPages = Math.ceil(total / pageSize);

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = parseInt(e.target.value) || 10;
    setTempPageSize(value);
  };

  const handleApplyPageSize = () => {
    onPageSizeChange(tempPageSize);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <>
      <div className={styles.bottomTop}>
        <div className={styles.searchZone}>
          <input
            type='text'
            name='search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder='검색어를 입력하세요.'
          />
          <button type='button'>
            <img
              src='/img/admin/watchcon/search.svg'
              alt='search'
            />
          </button>
        </div>
        <div className={styles.pageZone}>
          <p>Entries Per Page</p>
          <div>
            <select
              value={tempPageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            {/* <input
              type='number'
              min={1}
              value={tempPageSize}
              onChange={handlePageSizeChange}
            /> */}
          </div>
          <button
            type='button'
            onClick={handleApplyPageSize}
          >
            조회
          </button>
        </div>
      </div>
      <UserTable
        data={filteredData}
        isLoading={isLoading}
      />
      <div className={styles.pagination}>
        <button
          type='button'
          className={styles.pagePrev}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        <div className={styles.pageNumWrap}>
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1,
          ).map((page) => (
            <a
              key={page}
              href='#'
              className={
                page === currentPage ? styles.on : ''
              }
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </a>
          ))}
        </div>
        <button
          type='button'
          className={styles.pageNext}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
        <p>
          Showing{' '}
          <span className={styles.currentNum}>
            {Math.min(
              (currentPage - 1) * pageSize +
                (filteredData?.length || 0),
              total,
            )}
          </span>{' '}
          Of{' '}
          <span className={styles.totalNum}>{total}</span>{' '}
          Entries
        </p>
      </div>
    </>
  );
};

export default UserList;
