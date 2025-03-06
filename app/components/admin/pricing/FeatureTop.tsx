import { FC } from 'react';
import styles from './style/FeatureTop.module.css';

interface FeatureTopProps {
  data: any;
  onNextClick: () => void;
  onPrevClick: () => void;
  featureIndex: number;
  featureLimitTotal: number;
}

const FeatureTop: FC<FeatureTopProps> = ({
  data,
  onNextClick,
  onPrevClick,
  featureIndex,
  featureLimitTotal,
}) => {
  return (
    <>
      <div className={styles.featureBottom}>
        <button
          className={styles.datePrev}
          onClick={onPrevClick}
          disabled={featureIndex === 0}
        />
        <div className={styles.dateNumWrap}>
          <div>
            <p>공시일자</p>
            <input
              type='text'
              readOnly
              name='announcementDate'
              value={data?.notice_at.split(' ')[0]}
              style={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <p>적용일자</p>
            <input
              type='text'
              readOnly
              name='effectiveDate'
              value={data?.apply_at.split(' ')[0]}
              style={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <p>만기일자</p>
            <input
              type='text'
              readOnly
              name='expirationDate'
              value={data?.expired_at.split(' ')[0]}
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>
        <button
          className={styles.dateNext}
          onClick={onNextClick}
          disabled={featureIndex === featureLimitTotal - 1}
        />
      </div>
    </>
  );
};

export default FeatureTop;
