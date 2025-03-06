'use client';

import { apiConfig } from '@/app/api/config/api-config';
import { useUserMutation } from '@/app/hooks/mutations/admin/user/useUserMutation';
import {
  useMailResultQuery,
  useUserQuery,
} from '@/app/hooks/queries/admin/user/useUserQuery';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { format } from 'date-fns';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/SelectRecipientModal.module.css';

interface SelectRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'choice' | 'result';
  onSelect?: (users: string[]) => void;
  existingRecipients?: string[];
}

export const SelectRecipientModal = ({
  isOpen,
  onClose,
  mode,
  onSelect,
  existingRecipients = [],
}: SelectRecipientModalProps) => {
  const [hasFailedItems, setHasFailedItems] =
    useState(false);
  const [isResending, setIsResending] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPageSize, setCurrentPageSize] =
    useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(
    () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      date.setDate(1);
      return date;
    },
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(),
  );
  const [selectedUsers, setSelectedUsers] = useState<
    string[]
  >(existingRecipients);
  const [selectAll, setSelectAll] = useState(false);

  if (!isOpen) return null;

  const { mailResultData, total } = useMailResultQuery({
    mail_id: 1,
    page_size: currentPageSize,
    page_no: currentPage,
  });

  const {
    userData,
    isLoading: userLoading,
    total: userTotal,
    refetch,
  } = useUserQuery({
    page_size: currentPageSize,
    page_no: currentPage,
    type: 'user',
    start_time: startDate
      ? format(startDate, 'yyyy-MM-dd')
      : undefined,
    end_time: endDate
      ? format(endDate, 'yyyy-MM-dd')
      : undefined,
  });

  const { createMail } = useUserMutation();

  const filteredResults =
    mode === 'result' && mailResultData
      ? mailResultData
          .filter((result) => result.from_where === '3')
          .filter((result) =>
            result.user_id
              .toLowerCase()
              .includes(searchText.toLowerCase()),
          )
      : mailResultData;

  useEffect(() => {
    if (mode === 'result' && filteredResults) {
      const hasFailedResults = filteredResults.some(
        (result) => result.result === '0',
      );
      setHasFailedItems(hasFailedResults);
    }
  }, [mode, filteredResults]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      (mode === 'choice' ? userTotal : total) /
        currentPageSize,
    ),
  );

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = parseInt(e.target.value);
    if (!isNaN(newSize) && newSize > 0) {
      setPageSize(newSize);
    }
  };

  const handleSearch = () => {
    setCurrentPageSize(pageSize);
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredUserData =
    mode === 'choice' && userData
      ? userData.filter((user) =>
          user.username
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        )
      : userData;

  // username이 중복되지 않은 데이터만 필터링
  const uniqueFilteredUserData = useMemo(() => {
    if (!filteredUserData) return [];

    const uniqueUsers = new Map();

    return filteredUserData.filter((user) => {
      if (!uniqueUsers.has(user.username)) {
        uniqueUsers.set(user.username, true);
        return true;
      }
      return false;
    });
  }, [filteredUserData]);

  const handleSelectAll = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (mode === 'choice' && uniqueFilteredUserData) {
      if (checked) {
        const newUsernames = uniqueFilteredUserData.map(
          (user) => user.username,
        );
        setSelectedUsers((prev) =>
          Array.from(new Set([...prev, ...newUsernames])),
        );
      } else {
        const pageUsernames = uniqueFilteredUserData.map(
          (user) => user.username,
        );
        setSelectedUsers((prev) =>
          prev.filter(
            (username) => !pageUsernames.includes(username),
          ),
        );
      }
    }
  };

  const handleCheckboxChange = (username: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(username)) {
        return prev.filter((u) => u !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(selectedUsers);
    }
    onClose();
  };

  const handleResend = async () => {
    if (!filteredResults) return;

    setIsResending(true);
    try {
      const failedItems = filteredResults.filter(
        (result) => result.result === '0',
      );

      for (const item of failedItems) {
        try {
          const response = await privateApiInstance.get(
            `${apiConfig.USER.MAILING_LIST.DETAIL}?id=${item.id}`,
          );

          const mailDetail = response.data.data;

          if (mailDetail) {
            await createMail({
              title: mailDetail.title,
              receiver_list:
                mailDetail.receiver_list.split(','),
              content: mailDetail.content,
              from_where: 3,
              attached_file: mailDetail.attached_file,
            });
          }
        } catch (error) {
          console.error(
            `Failed to process item ${item.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      console.error('Error during resend:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.SelectRecipientModalOverlay}>
      <div className={styles.SelectRecipientModal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <Image
            src={x}
            alt='close'
            width={20}
            height={20}
          />
        </button>

        {mode === 'result' && hasFailedItems && (
          <button
            className={styles.resendButton}
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? '재발송 중...' : '재발송'}
          </button>
        )}

        <div className={styles.modalContent}>
          {isResending && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}>
                재발송 처리중...
              </div>
            </div>
          )}
          <h2 className={styles.modalTitle}>
            {mode === 'choice'
              ? '수신자 선택'
              : '발송 결과'}
          </h2>
          <div className={styles.modalBody}>
            {mode === 'choice' ? (
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
          <div className={styles.bottomTop}>
            <div className={styles.pageZone}>
              <p>Entries Per Page</p>
              <div>
                <select
                  value={pageSize}
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
                  onChange={handlePageSizeChange}
                  min={1}
                /> */}
              </div>
              <button onClick={handleSearch}>조회</button>
            </div>
            <div className={styles.searchZone}>
              <input
                type='text'
                placeholder='사용자 이름으로 검색'
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />
              <button>
                <img
                  src='/img/admin/watchcon/search.svg'
                  alt='search'
                />
              </button>
            </div>
          </div>
          <form action='' className={styles.form}>
            <div className={styles.tableInner}>
              {mode === 'choice' ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input
                            type='checkbox'
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>사용자</th>
                        <th>등록날짜</th>
                        <th>만료날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueFilteredUserData.map(
                        (user, index: number) => (
                          <tr key={index}>
                            <td>
                              <input
                                type='checkbox'
                                checked={selectedUsers.includes(
                                  user.username,
                                )}
                                onChange={() =>
                                  handleCheckboxChange(
                                    user.username,
                                  )
                                }
                              />
                            </td>
                            <td>{user.username}</td>
                            <td>
                              {
                                user.published_time.split(
                                  ' ',
                                )[0]
                              }
                            </td>
                            <td>
                              {
                                user.license_expired_time.split(
                                  ' ',
                                )[0]
                              }
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                  <div className={styles.pagination}>
                    <button
                      className={styles.pagePrev}
                      onClick={() =>
                        handlePageChange(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                    />
                    <div className={styles.pageNumWrap}>
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1,
                      ).map((pageNum) => (
                        <a
                          key={pageNum}
                          href='#'
                          className={
                            pageNum === currentPage
                              ? styles.on
                              : ''
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                        >
                          {pageNum}
                        </a>
                      ))}
                    </div>
                    <button
                      className={styles.pageNext}
                      onClick={() =>
                        handlePageChange(currentPage + 1)
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
                </>
              ) : (
                <>
                  {filteredResults &&
                  filteredResults.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>사용자</th>
                          <th>등록날짜</th>
                          <th>만료날짜</th>
                          <th>결과</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults?.map((result) => (
                          <tr key={result.id}>
                            <td>{result.user_id}</td>
                            <td>
                              {
                                result.created_at.split(
                                  ' ',
                                )[0]
                              }
                            </td>
                            <td>
                              {result.updated_at || ''}
                            </td>
                            <td>
                              <span>
                                {result.result === '1'
                                  ? 'Success'
                                  : 'Fail'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className={styles.noResults}>
                      발송 결과가 없습니다
                    </div>
                  )}
                  <div className={styles.pagination}>
                    <button
                      className={styles.pagePrev}
                      onClick={() =>
                        handlePageChange(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                    />
                    <div className={styles.pageNumWrap}>
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1,
                      ).map((pageNum) => (
                        <a
                          key={pageNum}
                          href='#'
                          className={
                            pageNum === currentPage
                              ? styles.on
                              : ''
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                        >
                          {pageNum}
                        </a>
                      ))}
                    </div>
                    <button
                      className={styles.pageNext}
                      onClick={() =>
                        handlePageChange(currentPage + 1)
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
                </>
              )}
            </div>
            <div className={styles.modalBottom}>
              <div className={styles.buttonContainer}>
                {mode === 'result' ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                  >
                    닫기
                  </button>
                ) : (
                  <button onClick={handleApply}>
                    적용
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
