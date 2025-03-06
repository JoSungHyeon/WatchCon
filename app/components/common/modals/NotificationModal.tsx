'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/NotificationModal.module.css';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  date?: string;
  confirmLabel?: string;
  noticeId: string;
  cookieExpireDays?: number;
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
}

export const NotificationModal = ({
  isOpen,
  onClose,
  title,
  content,
  date,
  confirmLabel = '닫기',
  noticeId,
  cookieExpireDays = 1,
  onDragStart,
  onDragMove,
  onDragEnd,
}: NotificationModalProps) => {
  const [shouldShow, setShouldShow] = useState(isOpen);
  const [dontShowChecked, setDontShowChecked] =
    useState(false);

  // 쿠키 이름 생성
  const cookieName = `notice_${noticeId}`;

  useEffect(() => {
    // 쿠키 체크
    const noticeCookie = Cookies.get(cookieName);
    if (noticeCookie) {
      setShouldShow(false);
    } else {
      setShouldShow(isOpen);
    }
  }, [isOpen, cookieName]);

  const handleClose = () => {
    if (dontShowChecked) {
      // 오늘 하루 열지 않음 체크시 쿠키 저장
      const expires = new Date();
      expires.setDate(expires.getDate() + cookieExpireDays);

      Cookies.set(cookieName, 'true', {
        expires: expires,
        path: '/',
      });
    }
    setShouldShow(false);
    onClose();
  };

  if (!shouldShow) return null;

  return (
    <div className={styles.notificationModalOverlay}>
      <div className={styles.notificationModal}>
        <button
          onClick={handleClose}
          className={styles.closeButton}
        >
          <Image
            src={x}
            alt='close'
            width={20}
            height={20}
          />
        </button>

        <div className={styles.modalContent}>
          <h2
            className={styles.modalTitle}
            style={{ cursor: 'move' }}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
          >
            {title}
          </h2>

          {date && (
            <p className={styles.modalDate}>{date}</p>
          )}

          <div
            className={styles.modalBody}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className={styles.modalBottom}>
            <div className={styles.checkboxContainer}>
              <label className={styles.checkboxLabel}>
                <input
                  type='checkbox'
                  checked={dontShowChecked}
                  onChange={(e) =>
                    setDontShowChecked(e.target.checked)
                  }
                  className={styles.checkbox}
                />
                <span>오늘 하루 열지 않음</span>
              </label>
            </div>

            <div className={styles.buttonContainer}>
              <button
                onClick={handleClose}
                className={styles.confirmButton}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
