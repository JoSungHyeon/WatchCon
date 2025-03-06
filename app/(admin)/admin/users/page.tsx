'use client';

import { useUserQuery } from '@/app/hooks/queries/admin/user/useUserQuery';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MailingList from '../../../components/admin/user/MailingList';
import UserList from '../../../components/admin/user/UserList';
import styles from '../../../components/admin/user/style/User.module.css';
import AdminMenu from '../../../components/layout/AdminMenu';

const UserPage: React.FC = () => {
  const [list, setList] = useState('user');
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
  const [mailStartDate, setMailStartDate] =
    useState<Date | null>(() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    });
  const [mailEndDate, setMailEndDate] =
    useState<Date | null>(new Date());
  const [currentMailPage, setCurrentMailPage] = useState(1);
  const [mailPageSize, setMailPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [queryParams, setQueryParams] = useState({
    start_time: format(
      new Date(
        new Date().setMonth(new Date().getMonth() - 3),
      ),
      'yyyy-MM-dd',
    ),
    end_time: format(new Date(), 'yyyy-MM-dd'),
    page_no: 1,
    page_size: 10,
    type: 'user' as 'user' | 'mail',
  });

  const handleRefetch = async (params?: {
    page_size?: number;
    page_no?: number;
  }) => {
    if (params) {
      setQueryParams((prev) => ({
        ...prev,
        ...params,
        type: list as 'user' | 'mail',
      }));
    }
    await refetch();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return undefined;
    return format(date, 'yyyy-MM-dd');
  };

  const {
    userData,
    isLoading,
    mailData,
    mailTotal,
    total,
    refetch,
  } = useUserQuery(queryParams, true);

  const handleListChange = (newList: 'user' | 'mail') => {
    setList(newList);
    setQueryParams({
      start_time:
        newList === 'user'
          ? formatDate(startDate)
          : formatDate(mailStartDate),
      end_time:
        newList === 'user'
          ? formatDate(endDate)
          : formatDate(mailEndDate),
      page_no:
        newList === 'user' ? currentPage : currentMailPage,
      page_size:
        newList === 'user' ? pageSize : mailPageSize,
      type: newList,
    });
  };

  const handleDateChange = (
    date: Date | null,
    isStart: boolean,
  ) => {
    if (list === 'user') {
      isStart ? setStartDate(date) : setEndDate(date);
    } else {
      isStart
        ? setMailStartDate(date)
        : setMailEndDate(date);
    }
  };

  const handleSearch = () => {
    setQueryParams({
      start_time:
        list === 'user'
          ? formatDate(startDate)
          : formatDate(mailStartDate),
      end_time:
        list === 'user'
          ? formatDate(endDate)
          : formatDate(mailEndDate),
      page_no:
        list === 'user' ? currentPage : currentMailPage,
      page_size: list === 'user' ? pageSize : mailPageSize,
      type: list as 'user' | 'mail',
    });
  };

  const handlePageChange = (newPage: number) => {
    if (list === 'user') {
      setCurrentPage(newPage);
    } else {
      setCurrentMailPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (list === 'user') {
      setPageSize(newSize);
      setCurrentPage(1);
    } else {
      setMailPageSize(newSize);
      setCurrentMailPage(1);
      setQueryParams((prev) => ({
        ...prev,
        page_size: newSize,
        page_no: 1,
        type: 'mail',
      }));
    }
  };

  useEffect(() => {
    if (shouldRefetch) {
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  return (
    <div className={styles.container}>
      <AdminMenu />
      <section className={styles.section}>
        <div className={styles.sectionTop}>
          <div className={styles.menuWrap}>
            <button
              className={`${list === 'user' ? styles.on : ''}`}
              onClick={() => handleListChange('user')}
            >
              User List
            </button>
            <button
              className={`${list === 'mail' ? styles.on : ''}`}
              onClick={() => handleListChange('mail')}
            >
              Mailling List
            </button>
          </div>
          {list === 'user' && (
            <div className={styles.dateWrap}>
              <div className={styles.calenderWrapper}>
                <div className={styles.calenderWrap}>
                  <DatePicker
                    selected={
                      list === 'user'
                        ? startDate
                        : mailStartDate
                    }
                    className={styles.datepickerInput}
                    onChange={(date: Date) =>
                      handleDateChange(date, true)
                    }
                    dateFormat='yyyy / MM / dd'
                    placeholderText='시작일 선택'
                  />
                </div>
                <span>~</span>
                <div className={styles.calenderWrap}>
                  <DatePicker
                    selected={
                      list === 'user'
                        ? endDate
                        : mailEndDate
                    }
                    className={styles.datepickerInput}
                    dateFormat='yyyy / MM / dd'
                    onChange={(date: Date) =>
                      handleDateChange(date, false)
                    }
                    placeholderText='종료일 선택'
                  />
                </div>
              </div>
              <button type='button' onClick={handleSearch}>
                조회
              </button>
            </div>
          )}
        </div>
        <div className={styles.sectionBottom}>
          {list === 'user' ? (
            <UserList
              data={userData}
              isLoading={isLoading}
              onPageSizeChange={handlePageSizeChange}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              total={total}
              pageSize={pageSize}
            />
          ) : (
            <MailingList
              data={mailData}
              total={mailTotal}
              refetch={handleRefetch}
              onPageSizeChange={handlePageSizeChange}
              page_size={mailPageSize}
              currentPage={currentMailPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default UserPage;
