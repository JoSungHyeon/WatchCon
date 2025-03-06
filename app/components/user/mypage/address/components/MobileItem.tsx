'use client';

import { AddressItemType } from '@/app/store/address.store';
import { FC } from 'react';
import styles from '../style/Address.module.css';

interface MobileItemProps {
  item: AddressItemType;
  onAction: (action: string, id: string) => void;
  actionState: string | null;
}

export const MobileItem: FC<MobileItemProps> = ({
  item,
  onAction,
  actionState,
}) => (
  <div key={item.row_id} className={styles.infoItem}>
    <div className={styles.itemLeft}>
      <span
        className={item.online ? styles.statusOn : ''}
      ></span>
      <div className={styles.leftTop}>
        <div>
          <span className={styles.name}>{item.alias}</span>
          <span className={styles.group}>
            {item.tags[0]}
          </span>
        </div>
        <span className={styles.itemId}>{item.id}</span>
      </div>
    </div>
    <div className={styles.itemRight}>
      <div className={styles.customSelect}>
        <select
          value={actionState || 'action'}
          onChange={(e) =>
            onAction(e.target.value, item.row_id)
          }
        >
          <option value='action'>Action</option>
          <option value='edit'>Edit</option>
          <option value='delete'>Delete</option>
        </select>
      </div>
    </div>
  </div>
);

export default MobileItem;
