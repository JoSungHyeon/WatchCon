'use client';

import Image from 'next/image';
import { FC, useEffect } from 'react';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/PolicyModal.module.css';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  footer: string;
}

export const PolicyModal: FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = 'unset';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = 'unset';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className={styles.policyModalOverlay}>
      <div className={styles.policyModal}>
        <Image
          src={x}
          alt='close'
          width={24}
          height={24}
          className={styles.closeButton}
          onClick={onClose}
        />
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>
          {content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className={styles.footer}>{footer}</div>
      </div>
    </div>
  );
};
