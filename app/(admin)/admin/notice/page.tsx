'use client';

import NoticeList from '@/app/components/admin/notice/NoticeList';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NewNotice from '../../../components/admin/notice/NewNotice';
import styles from '../../../components/admin/notice/style/Notice.module.css';
import AdminMenu from '../../../components/layout/AdminMenu';

const NoticePage: React.FC = () => {
  const [list, setList] = useState('list');
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setMonth(today.getMonth() - 3);
    return oneYearAgo;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [filterStartDate, setFilterStartDate] =
    useState<Date>(startDate);
  const [filterEndDate, setFilterEndDate] =
    useState<Date>(endDate);
  const [quill, setQuill] = useState<any>(null);

  const handleSearch = () => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
  };

  return (
    <div className={styles.container}>
      <AdminMenu />
      <section className={styles.section}>
        <div className={styles.sectionTop}>
          <div className={styles.menuWrap}>
            <button
              className={`${list === 'list' ? styles.on : ''}`}
              onClick={() => setList('list')}
            >
              Notice List
            </button>
            <button
              className={`${list === 'new' ? styles.on : ''}`}
              onClick={() => setList('new')}
            >
              New Notice
            </button>
            {list === 'new' ? null : list === 'details' ? (
              <button
                className={`${list === 'details' ? styles.on : ''}`}
                onClick={() => setList('details')}
              >
                Notice Details
              </button>
            ) : list === 'edit' ? (
              <button
                className={`${list === 'edit' ? styles.on : ''}`}
                onClick={() => setList('edit')}
              >
                Edit Notice
              </button>
            ) : null}
          </div>
          {list === 'list' ? (
            <div className={styles.dateWrap}>
              <div className={styles.calenderWrapper}>
                <div className={styles.calenderWrap}>
                  <DatePicker
                    className={styles.datepickerInput}
                    selected={startDate}
                    onChange={(date: Date) =>
                      setStartDate(date)
                    }
                    dateFormat='yyyy / MM / dd'
                  />
                </div>
                <span>~</span>
                <div className={styles.calenderWrap}>
                  <DatePicker
                    className={styles.datepickerInput}
                    selected={endDate}
                    onChange={(date: Date) =>
                      setEndDate(date)
                    }
                    dateFormat='yyyy / MM / dd'
                    minDate={startDate}
                  />
                </div>
              </div>
              <button onClick={handleSearch}>조회</button>
            </div>
          ) : null}
        </div>
        <div className={styles.sectionBottom}>
          {list === 'list' ? (
            <NoticeList
              startDate={filterStartDate}
              endDate={filterEndDate}
              setList={setList}
            />
          ) : (
            <NewNotice
              list={list}
              setList={setList}
              setQuill={setQuill}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default NoticePage;
