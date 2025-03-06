'use client';

import { useRequestMutation } from '@/app/hooks/mutations/request/useRequestMutation';
import { useTechQuery } from '@/app/hooks/queries/admin/tech/useTechQuery';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../../components/admin/sales/style/Sales.module.css';

// 클라이언트 컴포넌트로 동적 임포트
const AdminMenu = dynamic(
  () => import('../../../components/layout/AdminMenu'),
  { ssr: false },
);
const SalesList = dynamic(
  () => import('../../../components/admin/sales/SalesList'),
  { ssr: false },
);
const ReplyForm = dynamic(
  () => import('@/app/components/admin/sales/ReplyForm'),
  { ssr: false },
);
const DetailForm = dynamic(
  () => import('@/app/components/admin/sales/DetailForm'),
  { ssr: false },
);
const DatePicker = dynamic(
  () => import('react-datepicker'),
  { ssr: false },
);

// 타입 정의 추가
interface SalesItem {
  id: number;
  request_type: number;
  created_at: string;
  // 필요한 다른 필드들 추가
}

const SalesPage = () => {
  const queryClient = useQueryClient();
  const [isReply, setIsReply] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<SalesItem | null>(null);
  const [tempStartDate, setTempStartDate] =
    useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] =
    useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    null,
  );
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();

    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const { data } = useTechQuery({
    pageno: 1,
    pagesize: 10,
  });

  // 초기 데이터 상태를 null로 설정
  const [filteredData, setFilteredData] = useState<
    SalesItem[] | null
  >(null);

  useEffect(() => {
    if (data?.list) {
      const filtered = data.list.filter(
        (item: SalesItem) => {
          if (item.request_type !== 1) return false;

          if (!startDate || !endDate) return true;

          const [itemDateStr] = item.created_at.split(' ');
          const [itemYear, itemMonth, itemDay] = itemDateStr
            .split('-')
            .map(Number);

          const startYear = startDate.getFullYear();
          const startMonth = startDate.getMonth() + 1;
          const startDay = startDate.getDate();

          const endYear = endDate.getFullYear();
          const endMonth = endDate.getMonth() + 1;
          const endDay = endDate.getDate();

          const itemValue =
            itemYear * 10000 + itemMonth * 100 + itemDay;
          const startValue =
            startYear * 10000 + startMonth * 100 + startDay;
          const endValue =
            endYear * 10000 + endMonth * 100 + endDay;

          return (
            itemValue >= startValue && itemValue <= endValue
          );
        },
      );

      setFilteredData(
        filtered.length > 0 ? filtered : null,
      );
    } else {
      setFilteredData(null);
    }
  }, [data?.list, startDate, endDate]);

  const handleReplyChange = (
    isReply: boolean,
    item: SalesItem | null = null,
  ) => {
    setIsReply(isReply);
    setShowDetail(false);
    setSelectedItem(item);
  };

  const { deleteRequest } = useRequestMutation();

  const handleDeleteChange = async (id: number) => {
    try {
      await deleteRequest(true, id);
      await queryClient.invalidateQueries({
        queryKey: ['sales'],
      });

      setFilteredData((prev) => {
        const newData =
          prev?.filter((item) => item.id !== id) || null;
        console.log('업데이트된 데이터:', newData);
        return newData;
      });
    } catch (error) {
      console.error('삭제 중 오류가 발생했습니다:', error);
      alert(
        '삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleDetailChange = (item: SalesItem) => {
    setSelectedItem(item);
    setShowDetail(true);
    setIsReply(false);
  };

  const handleSearch = () => {
    setFilteredData([]);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setSearchKey((prev) => prev + 1);

    if (!data?.list) {
      return;
    }

    const filtered = data.list.filter((item: SalesItem) => {
      if (item.request_type !== 1) return false;

      if (!tempStartDate || !tempEndDate) return true;

      const [itemDateStr] = item.created_at.split(' ');
      const [itemYear, itemMonth, itemDay] = itemDateStr
        .split('-')
        .map(Number);

      const startYear = tempStartDate.getFullYear();
      const startMonth = tempStartDate.getMonth() + 1;
      const startDay = tempStartDate.getDate();

      const endYear = tempEndDate.getFullYear();
      const endMonth = tempEndDate.getMonth() + 1;
      const endDay = tempEndDate.getDate();

      const itemValue =
        itemYear * 10000 + itemMonth * 100 + itemDay;
      const startValue =
        startYear * 10000 + startMonth * 100 + startDay;
      const endValue =
        endYear * 10000 + endMonth * 100 + endDay;

      return (
        itemValue >= startValue && itemValue <= endValue
      );
    });

    setFilteredData(filtered);
  };

  return (
    <div className={styles.container}>
      <AdminMenu />
      <section className={styles.section}>
        <div className={styles.sectionTop}>
          <div className={styles.menuWrap}>
            <button className={styles.on}>
              {isReply
                ? 'Reply Sales Request'
                : showDetail
                  ? 'Sales Request Detail'
                  : 'Sales Requests'}
            </button>
          </div>
          {isReply ? null : showDetail ? null : (
            <div className={styles.dateWrap}>
              <div className={styles.calenderWrapper}>
                <div className={styles.calenderWrap}>
                  <DatePicker
                    className={styles.datepickerInput}
                    selected={tempStartDate}
                    onChange={(date: Date | null) =>
                      setTempStartDate(date)
                    }
                    dateFormat='yyyy / MM / dd'
                    selectsStart
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                  />
                </div>
                <span>~</span>
                <div className={styles.calenderWrap}>
                  <DatePicker
                    className={styles.datepickerInput}
                    selected={tempEndDate}
                    onChange={(date: Date | null) =>
                      setTempEndDate(date)
                    }
                    dateFormat='yyyy / MM / dd'
                    selectsEnd
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    minDate={tempStartDate}
                  />
                </div>
              </div>
              <button onClick={handleSearch}>조회</button>
            </div>
          )}
        </div>
        <div className={styles.sectionBottom}>
          {isReply ? (
            <ReplyForm
              selectedItem={selectedItem}
              onClose={() => setIsReply(false)}
            />
          ) : showDetail ? (
            <DetailForm
              selectedItem={selectedItem}
              onClose={() => setShowDetail(false)}
            />
          ) : (
            <SalesList
              key={searchKey}
              data={filteredData || []}
              onReplyChange={handleReplyChange}
              onDeleteChange={handleDeleteChange}
              onDetailChange={handleDetailChange}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default SalesPage;
