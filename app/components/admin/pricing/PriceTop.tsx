import { useModalStore } from '@/app/store/modal.store';
import { usePricingStore } from '@/app/store/pricing.store';
import { FC } from 'react';
import styles from './style/PriceTop.module.css';

const PriceTop: FC = () => {
  const { payUnit, setPayUnit } = usePricingStore();
  const { toggleState } = useModalStore();

  return (
    <div className={styles.priceTop}>
      <button onClick={() => toggleState('PRICING.new')}>
        New Price
      </button>
      {/* <select
        value={payUnit}
        onChange={(e) => setPayUnit(e.target.value)}
      >
        <option value='kw'>KW</option>
        <option value='usd'>USD</option>
      </select> */}
    </div>
  );
};

export default PriceTop;
