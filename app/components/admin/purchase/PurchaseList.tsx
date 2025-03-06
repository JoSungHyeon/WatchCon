import { usePurchaseStore } from '@/app/store/purchaseStore';
import { FC, useState } from 'react';
import styles from './style/PurchaseList.module.css';

interface PurchaseItem {
  id: string;
  is_repurchase: string;
  user_id: string;
  purchase_date: string;
  number_of_purchases: number;
  purchase_pay: number;
  license_type: string;
  license_no: string;
  price_id: string;
  discount_list_id: string;
  email: string;
  currency: string;
  price: number;
  discount_rate: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: null;
}

interface PurchaseListProps {
  purchaseData: PurchaseItem[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  total: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

const PurchaseList: FC<PurchaseListProps> = ({
  purchaseData,
  isLoading,
  currentPage,
  onPageChange,
  total,
  pageSize,
  onPageSizeChange,
}) => {
  const [tempPageSize, setTempPageSize] =
    useState(pageSize);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseItem | null>(null);

  const {
    sortConfig,
    setSortConfig,
    searchTerm,
    setSearchTerm,
  } = usePurchaseStore();

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = parseInt(e.target.value) || 10;
    setTempPageSize(newSize);
  };

  const handleInquiry = () => {
    onPageChange(1);
    onPageSizeChange(tempPageSize);
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

  const getLicenseTypeText = (type: string) => {
    switch (type) {
      case '3':
        return 'Business';
      case '2':
        return 'Premium';
      case '1':
        return 'Lite';
      default:
        return type;
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filteredPurchaseData = (
    Array.isArray(purchaseData) ? purchaseData : []
  ).filter((purchase) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      purchase.user_id
        .toString()
        .toLowerCase()
        .includes(searchLower) ||
      purchase.license_type
        .toLowerCase()
        .includes(searchLower) ||
      purchase.license_no
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const sortedData = [...filteredPurchaseData].sort(
    (a, b) => {
      if (sortConfig.key === 'id') {
        return sortConfig.direction === 'asc'
          ? Number(a.id) - Number(b.id)
          : Number(b.id) - Number(a.id);
      }
      if (sortConfig.key === 'user_id') {
        return sortConfig.direction === 'asc'
          ? a.user_id.localeCompare(b.user_id)
          : b.user_id.localeCompare(a.user_id);
      }
      if (sortConfig.key === 'purchase_date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.purchase_date).getTime() -
              new Date(b.purchase_date).getTime()
          : new Date(b.purchase_date).getTime() -
              new Date(a.purchase_date).getTime();
      }
      if (sortConfig.key === 'license_type') {
        return sortConfig.direction === 'asc'
          ? a.license_type.localeCompare(b.license_type)
          : b.license_type.localeCompare(a.license_type);
      }
      if (sortConfig.key === 'license_no') {
        return sortConfig.direction === 'asc'
          ? a.license_no.localeCompare(b.license_no)
          : b.license_no.localeCompare(a.license_no);
      }
      return 0;
    },
  );

  const totalPages = Math.ceil(total / pageSize);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <a
          key={i}
          href='#'
          className={currentPage === i ? styles.on : ''}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(i);
          }}
        >
          {i}
        </a>,
      );
    }
    return pages;
  };

  const handleRowClick = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.bottomTop}>
            <div className={styles.searchZone}>
              <input
                type='text'
                name='search'
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder='검색어를 입력하세요'
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
                  value={pageSize}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      onPageSizeChange(value);
                    }
                  }}
                  min='1'
                /> */}
              </div>
              <button onClick={handleInquiry}>조회</button>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
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
                  onClick={() => handleSort('user_id')}
                  style={{ cursor: 'pointer' }}
                >
                  사용자 이름{' '}
                  <span>
                    {sortConfig.key === 'user_id' &&
                      (sortConfig.direction === 'asc'
                        ? '▼'
                        : '▲')}
                  </span>
                </th>
                <th
                  onClick={() =>
                    handleSort('purchase_date')
                  }
                  style={{ cursor: 'pointer' }}
                >
                  구매일자{' '}
                  <span>
                    {sortConfig.key === 'purchase_date' &&
                      (sortConfig.direction === 'asc'
                        ? '▼'
                        : '▲')}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('license_type')}
                  style={{ cursor: 'pointer' }}
                >
                  라이센스 종류{' '}
                  <span>
                    {sortConfig.key === 'license_type' &&
                      (sortConfig.direction === 'asc'
                        ? '▼'
                        : '▲')}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('license_no')}
                  style={{ cursor: 'pointer' }}
                >
                  라이센스{' '}
                  <span>
                    {sortConfig.key === 'license_no' &&
                      (sortConfig.direction === 'asc'
                        ? '▼'
                        : '▲')}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData?.map((purchase) => (
                <tr
                  key={purchase.id}
                  onClick={() => handleRowClick(purchase)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className={styles.icon}>
                    {isToday(purchase.created_at) ? (
                      <img
                        src='/img/admin/purchase/new.svg'
                        alt='new'
                      />
                    ) : (
                      <img
                        src='/img/admin/purchase/default.svg'
                        alt='default'
                      />
                    )}
                  </td>
                  <td>{purchase.id}</td>
                  <td>{purchase.user_id}</td>
                  <td>
                    {purchase.purchase_date.split('T')[0]}
                  </td>
                  <td>
                    {getLicenseTypeText(
                      purchase.license_type,
                    )}
                  </td>
                  <td className={styles.key}>
                    {purchase.license_no}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button
              className={styles.pagePrev}
              onClick={() =>
                currentPage > 1 &&
                onPageChange(currentPage - 1)
              }
            ></button>
            <div className={styles.pageNumWrap}>
              {renderPageNumbers()}
            </div>
            <button
              className={styles.pageNext}
              onClick={() =>
                currentPage < totalPages &&
                onPageChange(currentPage + 1)
              }
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

          {selectedPurchase && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>세부정보</h2>
                <div className={styles.purchaseDetails}>
                  <p>
                    <label>사용자 이름:</label>
                    <span>{selectedPurchase.user_id}</span>
                  </p>
                  <p>
                    <label>Email:</label>
                    <span>{selectedPurchase.email}</span>
                  </p>
                  <p>
                    <label>구매일자:</label>
                    <span>
                      {
                        selectedPurchase.purchase_date.split(
                          'T',
                        )[0]
                      }
                    </span>
                  </p>
                  <p>
                    <label>라이센스 종류:</label>
                    <span>
                      {getLicenseTypeText(
                        selectedPurchase.license_type,
                      )}
                    </span>
                  </p>
                  <p>
                    <label>라이센스 번호:</label>
                    <span>
                      {selectedPurchase.license_no}
                    </span>
                  </p>
                  <p>
                    <label>화폐단위:</label>
                    <span>{selectedPurchase.currency}</span>
                  </p>
                  <p>
                    <label>비용:</label>
                    <span>{selectedPurchase.price}</span>
                  </p>
                  <p>
                    <label>할인율:</label>
                    <span>
                      {selectedPurchase.discount_rate}%
                    </span>
                  </p>
                  <p>
                    <label>구매수량:</label>
                    <span>{selectedPurchase.quantity}</span>
                  </p>
                  <p>
                    <label>전체비용:</label>
                    <span>
                      {selectedPurchase.total_price}
                    </span>
                  </p>
                </div>
                <button
                  className={styles.closeButton}
                  onClick={() => setSelectedPurchase(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PurchaseList;
