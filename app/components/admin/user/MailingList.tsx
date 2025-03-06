import { UserResponseDto } from '@/app/types/dto/user/response.dto';
import MailTable from './MailTable';

interface MailingListProps {
  data: UserResponseDto['MAILING_LIST']['data']['list'];
  total: number;
  onPageSizeChange: (newSize: number) => void;
  page_size: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  refetch: (params?: {
    page_size?: number;
    page_no?: number;
  }) => Promise<void>;
}

const MailingList: React.FC<MailingListProps> = ({
  data,
  total,
  onPageSizeChange,
  page_size,
  currentPage,
  onPageChange,
  refetch,
}) => {
  const handlePageSizeChange = async (newSize: number) => {
    try {
      await refetch({
        page_size: newSize,
        page_no: 1,
      });
      onPageSizeChange(newSize);
      onPageChange(1);
    } catch (error) {
      console.error('페이지 크기 변경 실패:', error);
    }
  };

  return (
    <MailTable
      data={data}
      total={total}
      onPageSizeChange={handlePageSizeChange}
      page_size={page_size}
      currentPage={currentPage}
      onPageChange={onPageChange}
      refetch={refetch}
    />
  );
};

export default MailingList;
