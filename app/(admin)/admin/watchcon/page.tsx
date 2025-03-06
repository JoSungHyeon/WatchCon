'use client';

import { AlertModal } from '@/app/components/common/modals/AlertModal';
import { useWatchconMutation } from '@/app/hooks/mutations/admin/watchcon/useWatchconMutation';
import { useWatchconQuery } from '@/app/hooks/queries/admin/watchcon/useWatchconQuery';
import { useModalStore } from '@/app/store/modal.store';
import { useWatchconStore } from '@/app/store/watchcon.store';
import { useState } from 'react';
import stylesA from '../../../components/admin/style/common.module.css';
import BlackTable from '../../../components/admin/watchcon/BlackTable';
import DisabledTable from '../../../components/admin/watchcon/DisabledTable';
import TotalTable from '../../../components/admin/watchcon/TotalTable';
import stylesB from '../../../components/admin/watchcon/style/watchcon.module.css';
import AdminMenu from '../../../components/layout/AdminMenu';

const WatchConPage: React.FC = () => {
  const [list, setList] = useState('total');
  const [search, setSearch] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tempPageSize, setTempPageSize] =
    useState(pageSize);

  const { disabledId, setDisabledId } = useWatchconStore();
  const { toggleState, ModalStates } = useModalStore();
  const { disableWatchcon } = useWatchconMutation();

  const [sortConfig, setSortConfig] = useState({
    key: 'no',
    direction: 'asc',
  });

  const {
    data,
    isLoading,
    total,
    pageSize: queryPageSize,
    blackList,
    blackListTotal,
    blackListPageSize,
    isLoadingBlack,
    refetchTotal,
    refetchBlack,
    disabledList,
    disabledListTotal,
    disabledListPageSize,
    isLoadingDisabled,
    refetchDisabled,
  } = useWatchconQuery({
    total_list: {
      pageNo,
      pageSize: list === 'total' ? pageSize : 10,
    },
    black_list: {
      pageNo,
      pageSize: list === 'black' ? pageSize : 10,
    },
    disabled_list: {
      pageNo,
      pageSize: list === 'disabled' ? pageSize : 10,
    },
  });

  const handleQuery = () => {
    setPageSize(tempPageSize);
    setPageNo(1);
    if (list === 'total') {
      refetchTotal();
    } else if (list === 'black') {
      refetchBlack();
    } else if (list === 'disabled') {
      refetchDisabled();
    }
  };

  // Filter data based on search keyword
  const filteredData = data?.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();

    // Convert login status to string for search
    const loginStatus =
      Number(item.login_status) > 0 ? 'pay' : 'free';

    return (
      item.watchcon_id
        ?.toString()
        .toLowerCase()
        .includes(searchLower) ||
      loginStatus.includes(searchLower)
    );
  });

  // Filter blackList data based on search keyword
  const filteredBlackList = blackList?.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();

    return item.watchcon_id
      ?.toString()
      .toLowerCase()
      .includes(searchLower);
  });

  const filteredDisabledList = disabledList?.filter(
    (item) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();

      return item.watchcon_id
        ?.toString()
        .toLowerCase()
        .includes(searchLower);
    },
  );

  // Get total pages based on current list type
  const totalPages = Math.ceil(
    list === 'total'
      ? (total || 0) / (queryPageSize || 10)
      : list === 'black'
        ? (blackListTotal || 0) / (blackListPageSize || 10)
        : list === 'disabled'
          ? (disabledListTotal || 0) /
            (disabledListPageSize || 10)
          : 0,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNo(newPage);
      if (list === 'total') {
        refetchTotal();
      } else if (list === 'black') {
        refetchBlack();
      } else if (list === 'disabled') {
        refetchDisabled();
      }
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5; // 한 번에 보여줄 최대 페이지 수

    if (totalPages <= maxVisible) {
      // 전체 페이지가 maxVisible 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 항상 첫 페이지 표시
      pageNumbers.push(1);

      let start = Math.max(2, pageNo - 1);
      let end = Math.min(totalPages - 1, pageNo + 1);

      // 첫 페이지와 시작 페이지 사이에 간격이 있으면 ... 추가
      if (start > 2) {
        pageNumbers.push('...');
      }

      // 중간 페이지들 추가
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // 마지막 페이지와 끝 페이지 사이에 간격이 있으면 ... 추가
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      // 항상 마지막 페이지 표시
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className={stylesA.container}>
      <AdminMenu />
      <section className={stylesA.section}>
        <div className={stylesB.sectionInner}>
          <div className={stylesB.sectionTop}>
            <button
              className={`${list === 'total' ? stylesB.on : ''}`}
              onClick={() => setList('total')}
            >
              Total List
            </button>
            <button
              className={`${list === 'black' ? stylesB.on : ''}`}
              onClick={() => setList('black')}
            >
              Black List
            </button>
            <button
              className={`${list === 'disabled' ? stylesB.on : ''}`}
              onClick={() => setList('disabled')}
            >
              Disabled List
            </button>
          </div>
          <div className={stylesB.sectionBottom}>
            <div className={stylesB.bottomTop}>
              <div className={stylesB.searchZone}>
                <input
                  type='text'
                  name='search'
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
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
              <div className={stylesB.pageZone}>
                <p>Entries Per Page</p>
                <div>
                  <select
                    value={tempPageSize}
                    onChange={(e) =>
                      setTempPageSize(
                        Number(e.target.value),
                      )
                    }
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <button onClick={handleQuery}>조회</button>
              </div>
            </div>
            {list === 'total' ? (
              <TotalTable
                data={filteredData}
                isLoading={isLoading}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
              />
            ) : list === 'black' ? (
              <BlackTable
                data={filteredBlackList || []}
                isLoading={isLoadingBlack}
              />
            ) : list === 'disabled' ? (
              <DisabledTable
                data={filteredDisabledList || []}
                isLoading={isLoadingDisabled}
              />
            ) : null}
            <div className={stylesB.pagination}>
              <button
                className={stylesB.pagePrev}
                onClick={() => handlePageChange(pageNo - 1)}
                disabled={pageNo <= 1}
              ></button>
              <div className={stylesB.pageNumWrap}>
                {getPageNumbers().map((pageNum, i) =>
                  pageNum === '...' ? (
                    <span key={`ellipsis_${i}`}>...</span>
                  ) : (
                    <a
                      key={`page_${pageNum}`}
                      href='#'
                      className={
                        pageNo === pageNum ? stylesB.on : ''
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum as number);
                      }}
                    >
                      {pageNum}
                    </a>
                  ),
                )}
              </div>
              <button
                className={stylesB.pageNext}
                onClick={() => handlePageChange(pageNo + 1)}
                disabled={pageNo >= totalPages}
              ></button>
              <p>
                Showing{' '}
                <span className={stylesB.currentNum}>
                  {pageNo}
                </span>{' '}
                Of{' '}
                <span className={stylesB.totalNum}>
                  {totalPages}
                </span>{' '}
                Pages
              </p>
            </div>
          </div>
        </div>

        {ModalStates.WATCHCON.disable && (
          <AlertModal
            isOpen={ModalStates.WATCHCON.disable}
            onClose={() => toggleState('WATCHCON.disable')}
            title='비활성화 하시겠습니까?'
            buttons={[
              {
                label: '취소',
                variant: 'secondary',
                onClick: () => {
                  setDisabledId('');
                  toggleState('WATCHCON.disable');
                },
              },
              {
                label: '확인',
                onClick: () => {
                  disableWatchcon(disabledId);
                  toggleState('WATCHCON.disable');
                },
              },
            ]}
          />
        )}
      </section>
    </div>
  );
};

export default WatchConPage;
