'use client';

import { AlertModal } from '@/app/components/common/modals/AlertModal';
import { useReplyQuery } from '@/app/hooks/queries/admin/reply/useReplyQuery';
import { useTechListStore } from '@/app/store/techListStore';
import React, { FC, useEffect, useState } from 'react';
import styles from './style/TechList.module.css';

interface TechListProps {
  data: any;
  onReplyChange?: (isReply: boolean, item: any) => void;
  onDeleteChange?: (id: number) => void;
  onDetailChange?: (item: any) => void;
}

const TechList: FC<TechListProps> = ({
  data,
  onReplyChange,
  onDeleteChange,
  onDetailChange,
}) => {
  const {
    data: replyData = [],
    isLoading,
    error,
    refetch,
  } = useReplyQuery(data?.id);

  const {
    isAscending,
    sortField,
    setIsAscending,
    setSortField,
  } = useTechListStore();

  const [techData, setTechData] = useState<any[]>([]);
  const [filteredTechData, setFilteredTechData] = useState<
    any[]
  >([]);

  const [searchParams, setSearchParams] = useState({
    pageno: 1,
    pagesize: 10,
    search: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [tempPageSize, setTempPageSize] = useState(
    searchParams.pagesize,
  );

  const [
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
  ] = useState(false);
  const [
    showDeleteCompleteModal,
    setShowDeleteCompleteModal,
  ] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<any>(null);

  const [showReplyModal, setShowReplyModal] =
    useState(false);
  const [selectedReply, setSelectedReply] =
    useState<any>(null);

  const [originalOrder, setOriginalOrder] = useState<{
    [key: number]: number;
  }>({});

  const paginatedData = filteredTechData.slice(
    (currentPage - 1) * searchParams.pagesize,
    currentPage * searchParams.pagesize,
  );

  const sortedData = [...paginatedData].sort((a, b) => {
    if (sortField === 'id') {
      return isAscending ? a.id - b.id : b.id - a.id;
    }
    if (sortField === 'title') {
      return isAscending
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortField === 'request_name') {
      return isAscending
        ? a.request_name.localeCompare(b.request_name)
        : b.request_name.localeCompare(a.request_name);
    }
    if (sortField === 'created_at') {
      return isAscending
        ? new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime();
    }
    return 0;
  });

  useEffect(() => {
    if (data) {
      const orderMap = data.reduce(
        (
          acc: { [key: number]: number },
          item: any,
          index: number,
        ) => {
          acc[item.id] = index + 1;
          return acc;
        },
        {},
      );
      setOriginalOrder(orderMap);
      setTechData(data);
      const totalItems = data.length;
      setTotalPages(
        Math.ceil(totalItems / searchParams.pagesize),
      );
    }
  }, [data, searchParams.pagesize]);

  useEffect(() => {
    if (techData.length > 0) {
      const filtered = techData.filter((item) => {
        const titleMatch = item.title
          .toLowerCase()
          .includes(searchParams.search.toLowerCase());

        const replyMatch = replyData
          ?.filter((reply) => reply.request_id === item.id)
          .some((reply) =>
            reply.content
              .toLowerCase()
              .includes(searchParams.search.toLowerCase()),
          );

        return titleMatch || replyMatch;
      });

      setFilteredTechData(filtered);
      setTotalPages(
        Math.ceil(filtered.length / searchParams.pagesize),
      );
    }
  }, [
    searchParams.search,
    techData,
    searchParams.pagesize,
    replyData,
  ]);

  const handleActionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    item: any,
  ) => {
    const selectedAction = e.target.value;
    if (selectedAction === 'reply') {
      onReplyChange?.(true, item);
    }
    if (selectedAction === 'delete') {
      setSelectedItem(item);
      setShowDeleteConfirmModal(true);
    }
    if (selectedAction === 'details') {
      onDetailChange?.(item);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      onDeleteChange?.(selectedItem.id);
      setShowDeleteConfirmModal(false);
      setShowDeleteCompleteModal(true);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    const validSize = Math.max(1, newSize);
    setTempPageSize(validSize);
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    const newSearchParams = {
      ...searchParams,
      pagesize: tempPageSize,
    };

    setSearchParams(newSearchParams);
    setCurrentPage(1);

    await refetch();

    if (techData.length > 0) {
      const filtered = techData.filter((item) =>
        item.title
          .toLowerCase()
          .includes(newSearchParams.search.toLowerCase()),
      );
      setFilteredTechData(filtered);
      setTotalPages(
        Math.ceil(filtered.length / tempPageSize),
      );
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setIsAscending(!isAscending);
    } else {
      setSortField(field);
      setIsAscending(true);
    }
  };

  const handleReplyClick = (reply: any) => {
    setSelectedReply(reply);
    setShowReplyModal(true);
  };

  if (!data) {
    return <div>is Loading...</div>;
  }

  return (
    <div className={styles.techListWrap}>
      <div className={styles.bottomTop}>
        <div className={styles.searchZone}>
          <input
            type='text'
            name='search'
            value={searchParams.search}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                search: e.target.value,
              })
            }
            placeholder='검색어를 입력하세요.'
          />
          <button>
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
              onChange={(e) =>
                handlePageSizeChange(Number(e.target.value))
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button onClick={handleSearch}>조회</button>
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
                {sortField === 'id'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th
              onClick={() => handleSort('title')}
              style={{ cursor: 'pointer' }}
            >
              제목{' '}
              <span>
                {sortField === 'title'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th
              onClick={() => handleSort('request_name')}
              style={{ cursor: 'pointer' }}
            >
              작성자{' '}
              <span>
                {sortField === 'request_name'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th
              onClick={() => handleSort('created_at')}
              style={{ cursor: 'pointer' }}
            >
              시간{' '}
              <span>
                {sortField === 'created_at'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th>편집</th>
          </tr>
        </thead>
        <tbody>
          {sortedData?.map((item) => (
            <React.Fragment key={item.id}>
              <tr>
                <td>{originalOrder[item.id]}</td>
                <td className={styles.title}>
                  <p>{item.title}</p>
                </td>
                <td>
                  <p>{item.request_name}</p>
                </td>
                <td>
                  <p>{item.created_at.split(' ')[0]}</p>
                </td>
                <td>
                  <select
                    onChange={(e) =>
                      handleActionChange(e, item)
                    }
                  >
                    <option value=''>Action</option>
                    <option value='reply'>Reply</option>
                    <option value='delete'>Delete</option>
                    <option value='details'>Details</option>
                  </select>
                </td>
              </tr>
              {replyData
                ?.filter(
                  (reply) => reply.request_id === item.id,
                )
                .map((reply) => (
                  <tr
                    key={reply.id}
                    className={styles.replyRow}
                    onClick={() => handleReplyClick(reply)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td></td>
                    <td className={styles.title}>
                      <div className={styles.replyContent}>
                        <span></span>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: reply.content,
                          }}
                        />
                      </div>
                    </td>
                    <td>관리자</td>
                    <td>
                      {reply.created_at.split(' ')[0]}
                    </td>
                    <td></td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className={styles.pagePrev}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        ></button>
        <div className={styles.pageNumWrap}>
          {[...Array(totalPages)].map((_, i) => (
            <a
              key={i + 1}
              href='#'
              className={
                currentPage === i + 1 ? styles.on : ''
              }
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i + 1);
              }}
            >
              {i + 1}
            </a>
          ))}
        </div>
        <button
          className={styles.pageNext}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        ></button>
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

      {showDeleteConfirmModal && (
        <AlertModal
          isOpen={showDeleteConfirmModal}
          onClose={() => {
            setShowDeleteConfirmModal(false);
            setSelectedItem(null);
          }}
          title='삭제하시겠습니까?'
          buttons={[
            {
              variant: 'secondary',
              onClick: () => {
                setShowDeleteConfirmModal(false);
                setSelectedItem(null);
              },
              label: '취소',
            },
            {
              variant: 'primary',
              onClick: handleDelete,
              label: '확인',
            },
          ]}
        />
      )}

      {showDeleteCompleteModal && (
        <AlertModal
          isOpen={showDeleteCompleteModal}
          onClose={() => {
            setShowDeleteCompleteModal(false);
            setSelectedItem(null);
          }}
          title='삭제가 완료되었습니다.'
          buttons={[
            {
              variant: 'primary',
              onClick: () => {
                setShowDeleteCompleteModal(false);
                setSelectedItem(null);
              },
              label: '확인',
            },
          ]}
        />
      )}

      {showReplyModal && selectedReply && (
        <AlertModal
          isOpen={showReplyModal}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReply(null);
          }}
          title='답변 상세 내용'
          content={
            <div>
              <p>작성자: 관리자</p>
              <p>작성일: {selectedReply.created_at}</p>
              <div>내용: </div>
              <div
                className={styles.replyContent}
                dangerouslySetInnerHTML={{
                  __html: selectedReply.content,
                }}
              />
            </div>
          }
          buttons={[
            {
              variant: 'primary',
              onClick: () => {
                setShowReplyModal(false);
                setSelectedReply(null);
              },
              label: '확인',
            },
          ]}
        />
      )}
    </div>
  );
};

export default TechList;
