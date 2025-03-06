'use client';

import { ChangeEvent, FC } from 'react';
import styles from '../style/Address.module.css';

interface PageSizeSelectorProps {
  value: number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onApply: () => void;
}

export const PageSizeSelector: FC<
  PageSizeSelectorProps
> = ({ value, onChange, onApply }) => (
  <div className={styles.pageZone}>
    <p>Entries Per Page</p>
    <div>
      <select
        name='pageSize'
        id='pageSize'
        onChange={onChange}
        value={value}
      >
        <option value='10'>10</option>
        <option value='20'>20</option>
        <option value='30'>30</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
      </select>
    </div>
    <button onClick={onApply}>조회</button>
  </div>
);

export default PageSizeSelector;
