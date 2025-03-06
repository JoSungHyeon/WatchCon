'use client';

import { FC, useMemo } from 'react';
import styles from '../style/Address.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = useMemo(() => 
    Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className={styles.pageMiddle}>
      <button
        className={styles.pagePrev}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
      <div className={styles.pageNumWrap}>
        {pageNumbers.map((num) => (
          <a
            key={num}
            href="#"
            className={num === currentPage ? styles.on : ''}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(num);
            }}
          >
            {num}
          </a>
        ))}
      </div>
      <button
        className={styles.pageNext}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};

export default Pagination;
