import {
  DetailModal,
  SelectRecipientModal,
} from '@/app/components/common/modals';
import { useUserMutation } from '@/app/hooks/mutations/admin/user/useUserMutation';
import { useContactFileMutation } from '@/app/hooks/mutations/contact/useContactMutation';
import { useUserMailDetailQuery } from '@/app/hooks/queries/admin/user/useUserQuery';
import { useMailStore } from '@/app/store/mail.store';
import { useModalStore } from '@/app/store/modal.store';
import { UserRequestDto } from '@/app/types/dto/user/request.dto';
import { UserResponseDto } from '@/app/types/dto/user/response.dto';
import dynamic from 'next/dynamic';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './style/Table.module.css';

interface EmailEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly: boolean;
  onReady: (editor: any) => void;
}
const EmailEditor = dynamic<EmailEditorProps>(
  () => import('../../layout/EmailEditor'),
  {
    ssr: false,
  },
);

interface MailTableProps {
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

const MailTable: FC<MailTableProps> = ({
  data = [],
  total,
  onPageSizeChange,
  page_size,
  currentPage,
  onPageChange,
  refetch,
}) => {
  const [write, setWrite] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tempPageSize, setTempPageSize] =
    useState(page_size);
  const [selectedRecipients, setSelectedRecipients] =
    useState<string[]>([]);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] =
    useState<string>('');
  const [mailId, setMailId] = useState<number>(0);
  const { ModalStates, toggleState } = useModalStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quill, setQuill] = useState<any>(null);
  const [preview, setPreview] = useState(false);

  const { createMail } = useUserMutation();
  const { mutate: uploadFile } = useContactFileMutation(
    () => {
      console.log('File uploaded successfully');
    },
  );
  const { mailDetailData, isLoading } =
    useUserMailDetailQuery(mailId);

  const {
    sortField,
    isAscending,
    setSortField,
    setIsAscending,
  } = useMailStore();

  useEffect(() => {
    setTempPageSize(page_size);
  }, [page_size]);

  const handleDetailClick = (id: string | number) => {
    const numId = Number(id);
    setMailId(numId);
    toggleState('USER.detail');
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      uploadFile(
        {
          file: file,
          username: '',
          email: '',
          subject: '',
          reciver: 0,
          message: '',
        },
        {
          onSuccess: (response: any) => {
            console.log('Upload response:', response);
            const fileUrl = response.url_file;
            if (fileUrl) {
              setUploadedFileUrl(fileUrl);
              setMailForm((prev) => ({
                ...prev,
                attached_file: fileUrl,
              }));
              console.log(
                'Updated mailForm with file URL:',
                fileUrl,
              );
            }
          },
          onError: (error) => {
            console.error('File upload failed:', error);
            setSelectedFile(null);
            setUploadedFileUrl('');
          },
        },
      );
    }
  };

  const [mailForm, setMailForm] = useState<
    UserRequestDto['MAILING_LIST']['POST']
  >({
    title: '',
    content: '',
    receiver_list: [],
    from_where: 3,
    attached_file: '',
  });

  const writeMail = () => {
    setWrite(true);
  };

  const handleRemoveRecipient = (recipient: string) => {
    setSelectedRecipients((prev) =>
      prev.filter((r) => r !== recipient),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mailData = {
        ...mailForm,
        receiver_list: selectedRecipients,
        attached_file: uploadedFileUrl,
      };

      console.log('Submitting mail data:', mailData);
      await createMail(mailData);

      setWrite(false);
      setSelectedRecipients([]);
      setSelectedFile(null);
      setUploadedFileUrl('');
      setMailForm({
        title: '',
        content: '',
        receiver_list: [],
        from_where: 3,
        attached_file: '',
      });
    } catch (error) {
      console.error('Failed to send mail:', error);
    }
  };

  const filteredData = data
    ?.filter(
      (mail) =>
        (mail?.title?.toLowerCase() || '').includes(
          searchText.toLowerCase(),
        ) ||
        (mail?.content?.toLowerCase() || '').includes(
          searchText.toLowerCase(),
        ),
    )
    .map((mail, index) => ({
      ...mail,
      originalNum: index + 1,
    }));

  const sortedAndFilteredData = [
    ...(filteredData || []),
  ].sort((a, b) => {
    if (sortField === 'no') {
      const indexA = new Date(a.created_at).getTime();
      const indexB = new Date(b.created_at).getTime();
      return isAscending
        ? indexA - indexB
        : indexB - indexA;
    } else if (sortField === 'date') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    } else {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return isAscending
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }
  });

  const isFormValid =
    mailForm.title.trim() !== '' &&
    mailForm.content.trim() !== '' &&
    selectedRecipients.length > 0;

  const totalPages = Math.ceil(total / page_size);

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTempPageSize(value);
    }
  };

  const handleApplyPageSize = async () => {
    try {
      console.log('Applying new page size:', tempPageSize);
      await refetch({
        page_size: tempPageSize,
        page_no: 1,
      });
      console.log('After refetch');
      onPageSizeChange(tempPageSize);
      onPageChange(1);
    } catch (error) {
      console.error('페이지 크기 변경 실패:', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectRecipients = (
    newRecipients: string[],
  ) => {
    setSelectedRecipients(newRecipients);
  };

  const renderContentInput = () => {
    if (preview) {
      return (
        <div className={styles.formContent}>
          <p>내용</p>
          <div
            className={styles.previewContent}
            dangerouslySetInnerHTML={{
              __html: mailForm.content,
            }}
          />
        </div>
      );
    }

    return (
      <div className={styles.formContent}>
        <p>내용</p>
        <div>
          <EmailEditor
            value={mailForm.content}
            onChange={(content: string) => {
              console.log('onChange content:', content);
              setMailForm((prev) => ({
                ...prev,
                content: content,
              }));
            }}
            readOnly={false}
            onReady={(editor: any) => {
              setQuill(editor);
              editor.on(
                'text-change',
                (
                  delta: any,
                  oldContents: any,
                  source: any,
                ) => {
                  const content = editor.root.innerHTML;
                  setMailForm((prev) => ({
                    ...prev,
                    content: content,
                  }));
                },
              );
            }}
          />
        </div>
      </div>
    );
  };

  const handleSort = (field: 'no' | 'date' | 'title') => {
    if (sortField === field) {
      setIsAscending(!isAscending);
    } else {
      setSortField(field);
      setIsAscending(true);
    }
  };

  if (write) {
    return (
      <>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.formTitle}>
            <p>제목</p>
            <input
              type='text'
              placeholder='제목을 입력하세요.'
              value={mailForm.title}
              onChange={(e) =>
                setMailForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className={styles.formRecipient}>
            <p>수신인</p>
            <div className={styles.recipientWrap}>
              <button
                type='button'
                onClick={() => toggleState('USER.receiver')}
              >
                수신자
              </button>
              <div className={styles.selectedRecipients}>
                {selectedRecipients.map((recipient) => (
                  <div
                    key={recipient}
                    className={styles.recipientChip}
                  >
                    <span>{recipient}</span>
                    <button
                      type='button'
                      onClick={() =>
                        handleRemoveRecipient(recipient)
                      }
                      className={styles.removeRecipient}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.formFile}>
            <p>첨부파일</p>
            <div className={styles.fileWrap}>
              <button
                type='button'
                onClick={handleFileButtonClick}
              >
                파일 찾기
              </button>
              <input
                type='text'
                placeholder='선택된 파일 없음'
                value={selectedFile?.name || ''}
                readOnly
              />
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {uploadedFileUrl && (
                <span className={styles.uploadSuccess}>
                  ✓ 파일이 업로드되었습니다
                </span>
              )}
            </div>
          </div>
          {renderContentInput()}
          <div className={styles.btnWarp}>
            <button
              type='button'
              onClick={() => setPreview(!preview)}
            >
              {preview ? '편집' : '미리보기'}
            </button>
            <button
              type='submit'
              disabled={!isFormValid}
              style={{
                cursor: isFormValid
                  ? 'pointer'
                  : 'not-allowed',
                opacity: isFormValid ? 1 : 0.5,
              }}
            >
              메일 보내기
            </button>
          </div>
        </form>
        {ModalStates.USER.receiver && (
          <SelectRecipientModal
            isOpen={ModalStates.USER.receiver}
            onClose={() => toggleState('USER.receiver')}
            mode='choice'
            onSelect={handleSelectRecipients}
            existingRecipients={selectedRecipients}
          />
        )}
        {ModalStates.USER.preview && (
          <DetailModal
            isOpen={ModalStates.USER.preview}
            onClose={() => toggleState('USER.preview')}
            title='메일 미리보기'
            mailTitle={mailForm.title}
            content={mailForm.content}
            receivers={selectedRecipients}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={styles.bottomTop}>
        <div className={styles.searchZone}>
          <input
            type='text'
            name='search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder='검색어를 입력하세요.'
          />
          <button type='button'>
            <img
              src='/img/admin/watchcon/search.svg'
              alt='search'
            />
          </button>
        </div>
        <div className={styles.pageZone}>
          <p>Entries Per Page</p>
          <div>
            <select
              value={tempPageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button
            type='button'
            onClick={handleApplyPageSize}
          >
            조회
          </button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              className={styles.num}
              onClick={() => handleSort('no')}
              style={{ cursor: 'pointer' }}
            >
              No{' '}
              <span>
                {sortField === 'no'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th
              onClick={() => handleSort('date')}
              style={{ cursor: 'pointer' }}
            >
              메일 발송일자{' '}
              <span>
                {sortField === 'date'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th
              onClick={() => handleSort('title')}
              style={{ cursor: 'pointer' }}
            >
              제목{' '}
              <span>
                {sortField === 'title'
                  ? isAscending
                    ? '▼'
                    : '▲'
                  : ''}
              </span>
            </th>
            <th className={styles.mailWrite}>
              <button type='button' onClick={writeMail}>
                메일 작성
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {!filteredData || filteredData.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.noData}>
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            sortedAndFilteredData.map((mail) => (
              <tr key={mail.id}>
                <td>{mail.originalNum}</td>
                <td>{mail.created_at.split(' ')[0]}</td>
                <td
                  onClick={() => handleDetailClick(mail.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {mail.title}
                </td>
                <td className={styles.mailWrite}>
                  <button
                    type='button'
                    onClick={() =>
                      toggleState('USER.result')
                    }
                  >
                    Result
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          type='button'
          className={styles.pagePrev}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        <div className={styles.pageNumWrap}>
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1,
          ).map((page) => (
            <a
              key={page}
              href='#'
              className={
                page === currentPage ? styles.on : ''
              }
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </a>
          ))}
        </div>
        <button
          type='button'
          className={styles.pageNext}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
        <p>
          Showing{' '}
          <span className={styles.currentNum}>
            {currentPage}
          </span>{' '}
          Of{' '}
          <span className={styles.totalNum}>
            {totalPages}
          </span>{' '}
          Pages
        </p>
      </div>
      {ModalStates.USER.result && (
        <SelectRecipientModal
          isOpen={ModalStates.USER.result}
          onClose={() => toggleState('USER.result')}
          mode='result'
        />
      )}
      {ModalStates.USER.detail &&
        !isLoading &&
        mailDetailData && (
          <DetailModal
            isOpen={ModalStates.USER.detail}
            onClose={() => {
              toggleState('USER.detail');
              setMailId(0);
            }}
            title='세부정보'
            mailTitle={mailDetailData[0]?.title || ''}
            content={mailDetailData[0]?.content || ''}
            receivers={
              mailDetailData[0]?.receiver_list
                ? mailDetailData[0].receiver_list
                    .split(',')
                    .filter(Boolean)
                : []
            }
            attachedFile={
              mailDetailData[0]?.attached_file || null
            }
          />
        )}
    </>
  );
};

export default MailTable;
