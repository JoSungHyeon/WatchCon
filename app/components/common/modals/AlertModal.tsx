import Image from 'next/image';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/AlertModal.module.css';

interface ButtonConfig {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: React.ReactNode;
  buttons: ButtonConfig[];
}

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  content,
  buttons,
}: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.alertModalOverlay}>
      <div className={styles.alertModal}>
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
          <h2 className={styles.modalTitle}>{title}</h2>
          {content}

          <div
            className={`${styles.buttonContainer} ${
              buttons.length > 1
                ? styles.twoButtons
                : styles.oneButton
            }`}
          >
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
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
      </div>
    </div>
  );
};
