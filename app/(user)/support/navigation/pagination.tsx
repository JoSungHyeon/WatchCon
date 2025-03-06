import { getPreviousNext } from '@/app/lib/support/markdown';
import Link from 'next/link';
import {
  LuChevronLeft,
  LuChevronRight,
} from 'react-icons/lu';

export default function Pagination({
  pathname,
}: {
  pathname: string;
}) {
  // 정규화 로직 수정
  const normalizedPath = pathname.startsWith('/ko/')
    ? pathname.slice(3) // '/ko/' 제거
    : pathname;

  const res = getPreviousNext(normalizedPath);

  // null 체크를 수정하고 기본값 처리
  if (!res || (!res.prev && !res.next)) {
    return null;
  }

  return (
    <div className='flex justify-between items-center mt-8'>
      {res.prev ? (
        <Link
          href={`/support/${res.prev.href}`}
          className='flex items-center gap-2 text-gray-500 hover:text-gray-700'
        >
          <LuChevronLeft />
          <span>{res.prev.title}</span>
        </Link>
      ) : (
        <div /> // 이전 버튼이 없을 때 공간 유지
      )}

      {res.next ? (
        <Link
          href={`/support/${res.next.href}`}
          className='flex items-center gap-2 text-gray-500 hover:text-gray-700'
        >
          <span>{res.next.title}</span>
          <LuChevronRight />
        </Link>
      ) : (
        <div /> // 다음 버튼이 없을 때 공간 유지
      )}
    </div>
  );
}
