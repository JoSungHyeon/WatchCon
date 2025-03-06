import { AlertModal } from '@/app/components/common/modals/AlertModal';
import { useNoticeMutation } from '@/app/hooks/mutations/admin/notice/useNoticeMutation';
import { useNoticeQuery } from '@/app/hooks/queries/admin/notice/useNoticeQuery';
import { usePageSearchReducer } from '@/app/hooks/reducers/usePageSearchReducer';
import { useModalStore } from '@/app/store/modal.store';
import { useNoticeStore } from '@/app/store/notice.store';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './style/NoticeList.module.css';

interface NoticeListProps {
  startDate: Date;
  endDate: Date;
  setList: (list: string) => void;
}

const NoticeList: FC<NoticeListProps> = ({
  startDate,
  endDate,
  setList,
}) => {
  const {
    selectedNoticeId,
    setSelectedNoticeId,
    sortConfig,
    setSortConfig,
  } = useNoticeStore();

  const { state, actions } = usePageSearchReducer({
    startDate,
    endDate,
  });

  const { pageSize, currentPage, searchInput, searchTerm } =
    state;

  const [tempPageSize, setTempPageSize] =
    useState(pageSize);

  const { ModalStates, toggleState } = useModalStore();

  const formatDate = (date: Date) => {
    if (
      !date ||
      !(date instanceof Date) ||
      isNaN(date.getTime())
    ) {
      console.error('유효하지 않은 날짜:', date);
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      '0',
    );
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, isLoading, error } = useNoticeQuery(
    {
      start_time: formatDate(startDate),
      end_time: formatDate(endDate),
      page_no: currentPage,
      page_size: pageSize,
    },
    true,
  );

  const { deleteNotice } = useNoticeMutation();

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = parseInt(e.target.value) || 10;
    setTempPageSize(newSize);
  };

  const handleInquiry = () => {
    actions.setPageSize(tempPageSize);
    actions.setCurrentPage(1);
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    actions.setSearchInput(e.target.value);
    actions.setSearchTerm(e.target.value);
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    noticeId: string,
  ) => {
    switch (e.target.value) {
      case 'new':
        setList('new');
        break;
      case 'edit':
        setSelectedNoticeId(noticeId);
        setList('edit');
        break;
      case 'details':
        setSelectedNoticeId(noticeId);
        setList('details');
        break;
      case 'delete':
        setSelectedNoticeId(noticeId);
        toggleState('NOTICE.delete');
        break;
    }
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key &&
        sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const filteredList = useMemo(
    () =>
      data?.list?.filter((item) =>
        item.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ) || [],
    [data?.list, searchTerm],
  );

  const totalPages = useMemo(
    () =>
      data?.total ? Math.ceil(data.total / pageSize) : 0,
    [data?.total, pageSize],
  );

  const currentPageData = useMemo(() => {
    if (!filteredList) return [];

    const sorted = [...filteredList]
      .map((item, index) => ({
        ...item,
        originalIndex: index + 1, // 원래 순서를 저장
      }))
      .sort((a, b) => {
        const direction =
          sortConfig.direction === 'asc' ? 1 : -1;

        switch (sortConfig.key) {
          case 'id':
            return direction * a.id.localeCompare(b.id);
          case 'title':
            return (
              direction * a.title.localeCompare(b.title)
            );
          case 'username':
            return (
              direction *
              a.username.localeCompare(b.username)
            );
          case 'created_at':
            return (
              direction *
              a.created_at.localeCompare(b.created_at)
            );
          default:
            return 0;
        }
      });

    return sorted;
  }, [filteredList, sortConfig]);

  useEffect(() => {
    console.log('시작 날짜:', formatDate(startDate));
    console.log('종료 날짜:', formatDate(endDate));
    console.log('쿼리 응답:', data);
  }, [startDate, endDate, data]);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;

  return (
    <>
      <div className={styles.bottomTop}>
        <div className={styles.searchZone}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <input
              type='text'
              name='search'
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder='검색어를 입력하세요.'
            />
            <button style={{ alignSelf: 'flex-end' }}>
              <img
                src='/img/admin/watchcon/search.svg'
                alt='search'
              />
            </button>
          </div>
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
          </div>
          <button onClick={handleInquiry}>조회</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              className={styles.num}
              onClick={() => handleSort('id')}
              style={{ cursor: 'pointer' }}
            >
              No{' '}
              <span>
                {sortConfig.key === 'id' &&
                  (sortConfig.direction === 'asc'
                    ? '▼'
                    : '▲')}
              </span>
            </th>
            <th
              onClick={() => handleSort('title')}
              style={{ cursor: 'pointer' }}
            >
              제목{' '}
              <span>
                {sortConfig.key === 'title' &&
                  (sortConfig.direction === 'asc'
                    ? '▼'
                    : '▲')}
              </span>
            </th>
            <th
              onClick={() => handleSort('username')}
              style={{ cursor: 'pointer' }}
            >
              작성자{' '}
              <span>
                {sortConfig.key === 'username' &&
                  (sortConfig.direction === 'asc'
                    ? '▼'
                    : '▲')}
              </span>
            </th>
            <th
              onClick={() => handleSort('created_at')}
              style={{ cursor: 'pointer' }}
            >
              시간{' '}
              <span>
                {sortConfig.key === 'created_at' &&
                  (sortConfig.direction === 'asc'
                    ? '▼'
                    : '▲')}
              </span>
            </th>
            <th>편집</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData?.map((item) => (
            <tr key={item.id}>
              <td>{item.originalIndex}</td>
              <td>{item.title}</td>
              <td>{item.username}</td>
              <td>{item.created_at.split(' ')[0]}</td>
              <td>
                <select
                  onChange={(e) =>
                    handleSelectChange(e, item.id)
                  }
                >
                  <option value=''>Action</option>
                  <option value='new'>New</option>
                  <option value='edit'>Edit</option>
                  <option value='details'>Details</option>
                  <option value='delete'>Delete</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className={styles.pagePrev}
          onClick={() =>
            actions.setCurrentPage(currentPage - 1)
          }
          disabled={currentPage === 1}
        />
        <div className={styles.pageNumWrap}>
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i + 1}
              href='#'
              className={
                currentPage === i + 1 ? styles.on : ''
              }
              onClick={(e) => {
                e.preventDefault();
                actions.setCurrentPage(i + 1);
              }}
            >
              {i + 1}
            </a>
          ))}
        </div>
        <button
          className={styles.pageNext}
          onClick={() =>
            actions.setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        />
        <p>
          Showing{' '}
          <span className={styles.currentNum}>
            {currentPage}
          </span>{' '}
          Of{' '}
          <span className={styles.totalNum}>
            {totalPages}
          </span>{' '}
          Pages
        </p>
      </div>

      {ModalStates.NOTICE.delete && (
        <AlertModal
          isOpen={ModalStates.NOTICE.delete}
          onClose={() => toggleState('NOTICE.delete')}
          title='정말 삭제하시겠습니까?'
          buttons={[
            {
              label: '취소',
              onClick: () => toggleState('NOTICE.delete'),
              variant: 'secondary',
            },
            {
              label: '삭제',
              onClick: () => {
                deleteNotice(selectedNoticeId);
                toggleState('NOTICE.delete');
              },
            },
          ]}
        />
      )}
    </>
  );
};

export default NoticeList;
