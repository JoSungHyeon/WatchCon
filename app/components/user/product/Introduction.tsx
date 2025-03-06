'use client';

import { useTranslation } from 'react-i18next';
import productKoImg from '../../../../public/img/introduction/item_img.png';
import productEnImg from '../../../../public/img/introduction/item_img_en.png';
import styles from './style/Introduction.module.css';

const Introduction: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  return (
    <section id={styles.introduction}>
      <div className={styles.introductionInner}>
        <div className={styles.introductionText}>
          <h2>{t('productPage.h2')}</h2>
          <p>
            <span>WatchCon</span>
            {t('productPage.p')}
          </p>
        </div>
        <div className={styles.introductionImg}>
          <img
            src={
              i18n.language === 'ko'
                ? productKoImg.src
                : productEnImg.src
            }
            alt='item_link'
          />
        </div>
      </div>
    </section>
  );
};

export default Introduction;
