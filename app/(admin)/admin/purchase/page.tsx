'use client';

import PurchaseList from '@/app/components/admin/purchase/PurchaseList';
import { usePurchaseQuery } from '@/app/hooks/queries/admin/purchase/usePurchaseQuery';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../../components/admin/purchase/style/Purchase.module.css';
import AdminMenu from '../../../components/layout/AdminMenu';

const PurchasePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    },
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(),
  );

  const [queryStartDate, setQueryStartDate] =
    useState<Date | null>(startDate);
  const [queryEndDate, setQueryEndDate] =
    useState<Date | null>(endDate);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { purchaseData, isLoading, total } =
    usePurchaseQuery({
      start_time: queryStartDate
        ? queryStartDate.toISOString().split('T')[0]
        : '',
      end_time: queryEndDate
        ? queryEndDate.toISOString().split('T')[0]
        : '',
      page_no: currentPage,
      page_size: pageSize,
    });

  const handleSearch = () => {
    setQueryStartDate(startDate);
    setQueryEndDate(endDate);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <AdminMenu />
      <section className={styles.section}>
        <div className={styles.sectionTop}>
          <div className={styles.menuWrap}>
            <button className={styles.on}>
              Purchase List
            </button>
          </div>
          <div className={styles.dateWrap}>
            <div className={styles.calenderWrapper}>
              <div className={styles.calenderWrap}>
                <DatePicker
                  selected={startDate}
                  className={styles.datepickerInput}
                  onChange={(date: Date) => {
                    setStartDate(date);
                  }}
                  dateFormat='yyyy / MM / dd'
                  placeholderText='시작일 선택'
                />
              </div>
              <span>~</span>
              <div className={styles.calenderWrap}>
                <DatePicker
                  selected={endDate}
                  className={styles.datepickerInput}
                  dateFormat='yyyy / MM / dd'
                  onChange={(date: Date) => {
                    setEndDate(date);
                  }}
                  placeholderText='종료일 선택'
                />
              </div>
            </div>
            <button onClick={handleSearch}>조회</button>
          </div>
        </div>
        <div className={styles.sectionBottom}>
          <PurchaseList
            purchaseData={
              Array.isArray(purchaseData)
                ? purchaseData
                : []
            }
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            total={total}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </section>
    </div>
  );
};

export default PurchasePage;
