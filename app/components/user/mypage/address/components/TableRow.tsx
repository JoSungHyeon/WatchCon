'use client';

import { AddressItemType } from '@/app/store/address.store';
import { FC } from 'react';
import styles from '../style/Address.module.css';

interface TableRowProps {
  item: AddressItemType;
  onAction: (action: string, id: string) => void;
  actionState: string | null;
  availableTags: string[];
}

export const TableRow: FC<TableRowProps> = ({
  item,
  onAction,
  actionState,
  availableTags,
}) => (
  <tr key={item.row_id}>
    <td>{item.index}</td>
    <td>
      {availableTags.includes(item.tags[0])
        ? item.tags[0]
        : '삭제된 그룹입니다'}
    </td>
    <td>{item.id}</td>
    <td>
      <span
        className={
          Number(item.online) === 1 ? styles.statusOn : ''
        }
      ></span>
    </td>
    <td>{item.alias}</td>
    <td>
      <div className={styles.customSelect}>
        <select
          value={actionState || 'action'}
          onChange={(e) => {
            onAction(e.target.value, item.row_id);
          }}
        >
          <option value='action'>Action</option>
          <option value='edit'>Edit</option>
          <option value='delete'>Delete</option>
        </select>
      </div>
    </td>
  </tr>
);

export default TableRow;
