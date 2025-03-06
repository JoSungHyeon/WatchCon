'use client';

import Image from 'next/image';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/GroupModal.module.css';

interface ButtonConfig {
  label: string;
  onClick: (inputValue: string) => void;
  variant?: 'primary' | 'secondary';
}

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'new' | 'edit';
  buttons: ButtonConfig[];
  currentCategoryName?: string;
  updatedCategoryName?: string;
  onUpdateCategoryName?: (value: string) => void;
  data?: any;
}

export const GroupModal = ({
  isOpen,
  onClose,
  buttons,
  mode,
  currentCategoryName,
  updatedCategoryName = '',
  onUpdateCategoryName,
  data,
}: GroupModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.groupModalOverlay}>
      <div className={styles.groupModal}>
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

        <div className={styles.modalContent}>
          {mode === 'new' ? (
            <>
              <h2 className={styles.modalTitle}>
                새 그룹 이름
              </h2>
              <div className={styles.modalBody}>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className={styles.form}
                >
                  <div className={styles.newInput}>
                    <input
                      type='text'
                      value={updatedCategoryName}
                      onChange={(e) =>
                        onUpdateCategoryName?.(
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className={styles.modalBottom}>
                    <div className={styles.buttonContainer}>
                      {buttons.map((button, index) => (
                        <button
                          key={index}
                          type='button'
                          onClick={(
                            e: React.MouseEvent,
                          ) => {
                            e.preventDefault();
                            button.onClick(
                              updatedCategoryName,
                            );
                          }}
                          disabled={
                            (button.variant === 'primary' &&
                              !updatedCategoryName.trim()) ||
                            data?.list.some(
                              (item) =>
                                item.category_name ===
                                updatedCategoryName,
                            )
                          }
                          className={`${styles.modalButton} ${
                            button.variant === 'secondary'
                              ? styles.secondary
                              : styles.primary
                          }`}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.modalTitle}>
                그룹 이름 편집
              </h2>
              <div className={styles.modalBody}>
                <form action='' className={styles.form}>
                  <div className={styles.inputWrap}>
                    <div className={styles.currentName}>
                      <p>현재</p>
                      <input
                        type='text'
                        value={currentCategoryName}
                        readOnly
                      />
                    </div>
                    <div className={styles.updateName}>
                      <p>신규</p>
                      <input
                        type='text'
                        value={updatedCategoryName}
                        onChange={(e) =>
                          onUpdateCategoryName?.(
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.modalBottom}>
                    <div className={styles.buttonContainer}>
                      {buttons.map((button, index) => (
                        <button
                          key={index}
                          disabled={
                            button.variant === 'primary' &&
                            !updatedCategoryName.trim()
                          }
                          onClick={(
                            e: React.MouseEvent,
                          ) => {
                            e.preventDefault();
                            button.onClick(
                              updatedCategoryName,
                            );
                          }}
                          className={`${styles.modalButton} ${
                            button.variant === 'secondary'
                              ? styles.secondary
                              : styles.primary
                          }`}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
