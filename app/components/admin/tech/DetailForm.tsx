'use client';

import { FC } from 'react';
import styles from './style/ReplyForm.module.css';

interface DetailFormProps {
  selectedItem: any;
  onClose?: () => void;
}

const DetailForm: FC<DetailFormProps> = ({
  selectedItem,
  onClose,
}) => {
  return (
    <>
      <div className={styles.requestZone}>
        <div className={styles.reqTop}>
          <p>제목</p>
          <input
            type='text'
            readOnly
            value={selectedItem.title}
          />
        </div>
        <div className={styles.reqMiddle}>
          <div className={styles.reqName}>
            <p>이름</p>
            <input
              type='text'
              readOnly
              value={selectedItem.request_name}
            />
          </div>
          <div className={styles.reqMail}>
            <p>이메일</p>
            <input
              type='email'
              readOnly
              value={selectedItem.request_email}
            />
          </div>
        </div>
        <div className={styles.reqBottom}>
          <p>요청내용</p>
          <div
            className={styles.contentDisplay}
            dangerouslySetInnerHTML={{
              __html: selectedItem.content,
            }}
          />
        </div>
        <button
          type='button'
          onClick={onClose}
          className={styles.detailBtn}
        >
          목록
        </button>
      </div>
    </>
  );
};

export default DetailForm;
