'use client';

import { AddressItemType } from '@/app/store/address.store';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface TableHeaderProps {
  onSort: (field: keyof AddressItemType) => void;
  sortField: keyof AddressItemType | null;
  sortDirection: 'asc' | 'desc';
}

export const TableHeader: FC<TableHeaderProps> = ({
  onSort,
  sortField,
  sortDirection,
}) => {
  const { t } = useTranslation('common');

  const getSortIcon = (field: keyof AddressItemType) => {
    if (sortField !== field) {
      return <span style={{ opacity: 1 }}>▼</span>;
    }
    return (
      <span style={{ opacity: 1 }}>
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <tr>
      <th onClick={() => onSort('index')}>
        No <span>{getSortIcon('index')}</span>
      </th>
      <th onClick={() => onSort('hostname')}>
        {t('myPage.address.group')}{' '}
        <span>{getSortIcon('hostname')}</span>
      </th>
      <th onClick={() => onSort('id')}>
        Watch ConID <span>{getSortIcon('id')}</span>
      </th>
      <th onClick={() => onSort('online')}>
        {t('myPage.address.status')}{' '}
        <span>{getSortIcon('online')}</span>
      </th>
      <th onClick={() => onSort('username')}>
        {t('myPage.address.name')}{' '}
        <span>{getSortIcon('username')}</span>
      </th>
      <th>{t('myPage.address.edit')}</th>
    </tr>
  );
};

export default TableHeader;
