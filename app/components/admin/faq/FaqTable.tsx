import { useFaqStore } from '@/app/store/faq.store';
import { useModalStore } from '@/app/store/modal.store';
import { AdminFaqResponseDto } from '@/app/types/dto/faq/response.dto';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import styles from './style/Table.module.css';

interface FaqTableProps {
  data?: AdminFaqResponseDto['GET']['list'];
}

const FaqTable: FC<FaqTableProps> = ({ data }) => {
  const router = useRouter();
  const {
    setFaqEditMode,
    setSelectedFaqId,
    sortConfig,
    setSortConfig,
  } = useFaqStore();
  const { toggleState } = useModalStore();

  // 원본 데이터에 originalNum 추가
  const dataWithOriginalNum = data?.map((item, index) => ({
    ...item,
    originalNum: index + 1,
  }));

  const getSortedData = () => {
    if (!dataWithOriginalNum) return [];
    return [...dataWithOriginalNum].sort((a, b) => {
      if (sortConfig.key === 'id') {
        const aNum = parseInt(a.id);
        const bNum = parseInt(b.id);
        return sortConfig.direction === 'asc'
          ? aNum - bNum
          : bNum - aNum;
      }
      if (sortConfig.key === 'is_notice') {
        return sortConfig.direction === 'asc'
          ? a.is_notice.localeCompare(b.is_notice)
          : b.is_notice.localeCompare(a.is_notice);
      }
      if (sortConfig.key === 'category_name') {
        const aName =
          a.category_name ?? '삭제된 그룹입니다.';
        const bName =
          b.category_name ?? '삭제된 그룹입니다.';
        return sortConfig.direction === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }
      if (sortConfig.key === 'subject') {
        return sortConfig.direction === 'asc'
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      }
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc'
          ? a.created_at.localeCompare(b.created_at)
          : b.created_at.localeCompare(a.created_at);
      }
      return 0;
    });
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key &&
        sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const handleAction = async (
    action: string,
    id: string,
  ) => {
    if (action === 'delete') {
      setSelectedFaqId(id);
      toggleState('FAQ.delete');
    } else if (action === 'detail') {
      await new Promise<void>((resolve) => {
        setFaqEditMode(false);
        resolve();
      });
      router.push(`/admin/faq/${id}`);
    } else if (action === 'edit') {
      await new Promise<void>((resolve) => {
        setFaqEditMode(true);
        resolve();
      });
      router.push(`/admin/faq/${id}`);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th
            className={styles.num}
            onClick={() => handleSort('id')}
            style={{ cursor: 'pointer' }}
          >
            No{' '}
            <span>
              {sortConfig.key === 'id'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('is_notice')}
            style={{ cursor: 'pointer' }}
          >
            Notice{' '}
            <span>
              {sortConfig.key === 'is_notice'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('category_name')}
            style={{ cursor: 'pointer' }}
          >
            Group{' '}
            <span>
              {sortConfig.key === 'category_name'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            className={styles.title}
            onClick={() => handleSort('subject')}
            style={{ cursor: 'pointer' }}
          >
            Title{' '}
            <span>
              {sortConfig.key === 'subject'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th
            onClick={() => handleSort('created_at')}
            style={{ cursor: 'pointer' }}
          >
            Register Date{' '}
            <span>
              {sortConfig.key === 'created_at'
                ? sortConfig.direction === 'asc'
                  ? '▼'
                  : '▲'
                : ''}
            </span>
          </th>
          <th className={styles.date}>Edit</th>
        </tr>
      </thead>
      <tbody>
        {getSortedData().map((item, index) => (
          <tr key={item.id}>
            <td>{item.originalNum}</td>
            <td>
              <input
                type='checkbox'
                checked={item.is_notice === '1'}
                readOnly
              />
            </td>
            <td>
              {item.category_name ?? '삭제된 그룹입니다.'}
            </td>
            <td className={styles.title}>{item.subject}</td>
            <td>{item.created_at.split(' ')[0]}</td>
            <td>
              <select
                onChange={(e) => {
                  handleAction(e.target.value, item.id);
                }}
                value=''
              >
                <option value=''>Action</option>
                <option value='edit'>Edit</option>
                <option value='delete'>Delete</option>
                <option value='detail'>Detail</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FaqTable;
