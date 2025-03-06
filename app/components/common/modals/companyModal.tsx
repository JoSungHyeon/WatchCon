'use client';

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import x from '../../../../public/img/modal/x.svg';
import styles from './style/companyModal.module.css';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyInfo: {
    name: string;
    ceo: string;
    services: string;
    address_main: string;
    address_sub: string;
    tel: string;
    fax: string;
  };
  history: {
    year: string;
    events: string[];
  }[];
}

export const CompanyModal: FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  companyInfo,
  history,
}) => {
  const [activeTab, setActiveTab] = useState<
    'info' | 'history'
  >('info');

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

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => setActiveTab('info')}
          >
            기업정보
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            연혁
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className={styles.infoContent}>
            <div className={styles.infoItem}>
              <span className={styles.label}>회사명</span>
              <span>{companyInfo.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>대표</span>
              <span>{companyInfo.ceo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>
                주요 서비스
              </span>
              <span>{companyInfo.services}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>
                사업장 주소(본사)
              </span>
              <span>{companyInfo.address_main}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>
                사업장 주소(부설연구소)
              </span>
              <span>{companyInfo.address_sub}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>TEL</span>
              <span>{companyInfo.tel}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>FAX</span>
              <span>{companyInfo.fax}</span>
            </div>
          </div>
        ) : (
          <div className={styles.historyContent}>
            {history.map((item, index) => (
              <div
                key={index}
                className={styles.historyItem}
              >
                <h3 className={styles.year}>{item.year}</h3>
                <ul className={styles.events}>
                  {item.events.map((event, i) => (
                    <li key={i}>{event}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
