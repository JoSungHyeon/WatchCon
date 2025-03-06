'use client';

import Image from 'next/image';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/DetailModal.module.css';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mailTitle: string;
  content: string;
  receivers?: string[];
  attachedFile?: string | null;
}

export const DetailModal = ({
  isOpen,
  onClose,
  title,
  mailTitle,
  content,
  receivers,
  attachedFile,
}: DetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.detailModalOverlay}>
      <div className={styles.detailModal}>
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
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label>제목</label>
            <p>{mailTitle || '-'}</p>
          </div>
          <div className={styles.field}>
            <label>수신자</label>
            <p>{receivers.join(', ')}</p>
          </div>
          <div className={styles.field}>
            <label>내용</label>
            <p>{content || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
