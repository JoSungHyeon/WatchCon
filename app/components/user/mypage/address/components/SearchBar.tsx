'use client';

import { ChangeEvent, FC, KeyboardEvent } from 'react';
import styles from '../style/Address.module.css';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
}) => {
  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.searchZone}>
      <input
        type='text'
        name='search'
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder='검색어를 입력하세요'
      />
      <button onClick={onSearch}>
        <img src='/img/mypage/search.png' alt='search' />
      </button>
    </div>
  );
};

export default SearchBar;
