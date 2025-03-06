'use client';

import { AlertModal } from '@/app/components/common/modals/AlertModal';
import {
  useReplyFileMutation,
  useReplyMutation,
} from '@/app/hooks/mutations/admin/reply/useReplyMutation';
import { useReplyItemQuery } from '@/app/hooks/queries/admin/reply/useReplyQuery';
import dynamic from 'next/dynamic';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './style/ReplyForm.module.css';

interface EmailEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly: boolean;
  onReady: (editor: any) => void;
}

const EmailEditor = dynamic<EmailEditorProps>(
  () => import('@/app/components/layout/EmailEditor'),
  {
    ssr: false,
    loading: () => <p>로딩중...</p>,
  },
);

interface ReplyFormProps {
  selectedItem: any;
  onReplySubmit?: () => void;
  onClose?: () => void;
}

// 파일 업로드 응답 타입 정의 수정
interface FileUploadResponse {
  url_file: string;
  status?: number;
  message?: string;
}

const ReplyForm: FC<ReplyFormProps> = ({
  selectedItem,
  onReplySubmit,
  onClose,
}) => {
  const [preview, setPreview] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [pendingMailData, setPendingMailData] =
    useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] =
    useState(false);

  const { createMail } = useReplyMutation();
  const { mutateAsync: uploadFile } = useReplyFileMutation(
    () => {
      console.log('파일 업로드 성공');
    },
  );
  const { data: replyItem } = useReplyItemQuery({
    request_id: selectedItem.id,
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null as File | null,
    fileName: '',
  });

  const editorRef = useRef<any>(null);
  const [editorKey, setEditorKey] = useState(0);

  console.log(replyItem);

  useEffect(() => {
    // 컴포넌트 언마운트 시 에디터 인스턴스 정리
    return () => {
      if (editorRef.current) {
        editorRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        fileName: file.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const editorContent = formData.content;

    if (!formData.title.trim() || !editorContent) {
      setAlertMessage('제목과 내용을 모두 입력해주세요.');
      setShowAlert(true);
      return;
    }

    const mailData = {
      request_id: selectedItem.id,
      append_id: replyItem?.length
        ? replyItem[replyItem.length - 1].id
        : null,
      depth: replyItem?.length || 0,
      file_yn: formData.file ? 'Y' : ('N' as 'Y' | 'N'),
      file_name: formData.fileName,
      title: formData.title.trim(),
      content: editorContent,
    };

    setPendingMailData(mailData);
    setAlertMessage('메일을 전송하시겠습니까?');
    setShowAlert(true);
  };

  const handleConfirmSend = async () => {
    try {
      let uploadedFileName = '';

      if (formData.file) {
        try {
          console.log('파일 업로드 시작');

          const uploadResult = await uploadFile({
            file: formData.file,
          });
          console.log('파일 업로드 응답:', uploadResult);

          // 응답에서 직접 url_file 추출 (UPLOAD 참조 제거)
          const fileUrl = uploadResult.url_file;

          if (!fileUrl) {
            throw new Error(
              '파일 업로드 응답에서 URL을 찾을 수 없습니다.',
            );
          }

          uploadedFileName = fileUrl;
          console.log('파일 업로드 성공, URL:', fileUrl);
        } catch (uploadError) {
          console.error('파일 업로드 실패:', uploadError);
          setAlertMessage(
            uploadError instanceof Error
              ? uploadError.message
              : '파일 업로드에 실패했습니다. 다시 시도해주세요.',
          );
          setShowAlert(true);
          return;
        }
      }

      const mailDataToSend = {
        request_id: selectedItem.id,
        append_id: replyItem?.length
          ? replyItem[replyItem.length - 1].id
          : null,
        depth: replyItem?.length || 0,
        file_yn: formData.file
          ? ('Y' as const)
          : ('N' as const),
        file_name: uploadedFileName,
        title: formData.title.trim(),
        content: formData.content,
      };

      console.log('메일 전송 시작', mailDataToSend);

      // 메일 전송 시도
      try {
        const response = await createMail(mailDataToSend);
        console.log('메일 전송 성공:', response);

        // 성공 모달 표시
        setIsSuccessModalOpen(true);
      } catch (mailError) {
        console.error('메일 전송 실패:', mailError);
        throw mailError;
      }
    } catch (error) {
      console.error('전체 프로세스 실패:', error);
      setAlertMessage(
        '메일 전송에 실패했습니다. 다시 시도해주세요.',
      );
      setShowAlert(true);
    }
  };

  const togglePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    if (preview) {
      // 미리보기 모드 종료 시
      try {
        // editorRef가 존재하고 destroy 함수가 있는 경우에만 실행
        if (
          editorRef.current?.destroy &&
          typeof editorRef.current.destroy === 'function'
        ) {
          editorRef.current.destroy();
        }
      } catch (error) {
        console.log('Editor cleanup error:', error);
      } finally {
        editorRef.current = null;
        setTimeout(() => {
          setPreview(false);
          setEditorKey((prev) => prev + 1);
        }, 100);
      }
    } else {
      setPreview(true);
    }
  };

  const renderMessageInput = () => {
    if (preview) {
      return (
        <div className={styles.formMessage}>
          <p>메시지</p>
          <div
            className={styles.previewContent}
            dangerouslySetInnerHTML={{
              __html: formData.content,
            }}
          />
        </div>
      );
    }

    return (
      <div className={styles.resContent}>
        <p>내용</p>
        <div className={styles.editorContainer}>
          <EmailEditor
            key={editorKey}
            value={formData.content}
            onChange={(content) => {
              setFormData((prev) => ({
                ...prev,
                content: content,
              }));
            }}
            readOnly={false}
            onReady={(editor) => {
              // 이전 에디터 인스턴스 정리
              try {
                if (
                  editorRef.current?.destroy &&
                  typeof editorRef.current.destroy ===
                    'function'
                ) {
                  editorRef.current.destroy();
                }
              } catch (error) {
                console.log('Editor cleanup error:', error);
              }

              editorRef.current = editor;
              editor.on('text-change', () => {
                const content = editor.root.innerHTML;
                setFormData((prev) => ({
                  ...prev,
                  content: content,
                }));
              });
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.requestZone}>
        <div className={styles.reqTop}>
          <p>제목</p>
          <input
            type='text'
            readOnly
            value={selectedItem.title}
          />
        </div>
        <div className={styles.reqMiddle}>
          <div className={styles.reqName}>
            <p>이름</p>
            <input
              type='text'
              readOnly
              value={selectedItem.request_name}
            />
          </div>
          <div className={styles.reqMail}>
            <p>이메일</p>
            <input
              type='email'
              readOnly
              value={selectedItem.request_email}
            />
          </div>
        </div>
        <div className={styles.reqBottom}>
          <p>요청내용</p>
          <div
            className={styles.contentDisplay}
            dangerouslySetInnerHTML={{
              __html: selectedItem.content,
            }}
          />
        </div>
      </div>
      <form
        className={styles.responseZone}
        onSubmit={handleSubmit}
      >
        <div className={styles.resTop}>
          <div className={styles.resTitle}>
            <p>제목</p>
            <input
              type='text'
              placeholder='제목을 입력하세요.'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>
          <div className={styles.resFile}>
            <p>첨부파일</p>
            <div className={styles.fileWrap}>
              <button
                type='button'
                onClick={() =>
                  document
                    .getElementById('fileInput')
                    ?.click()
                }
              >
                파일 찾기
              </button>
              <input
                type='text'
                readOnly
                value={formData.fileName}
                placeholder='선택된 파일이 없습니다'
              />
              <input
                type='file'
                id='fileInput'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        {renderMessageInput()}
        <div className={styles.btnWrap}>
          <div className={styles.btnWrapLeft}>
            <button type='button' onClick={onClose}>
              목록
            </button>
            <button type='button' onClick={togglePreview}>
              {preview ? '닫기' : '미리보기'}
            </button>
          </div>
          <div className={styles.btnWrapRight}>
            <button type='submit'>메일 보내기</button>
          </div>
        </div>
      </form>
      {showAlert && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          title={alertMessage}
          buttons={[
            {
              variant: 'secondary',
              onClick: () => setShowAlert(false),
              label: '취소',
            },
            {
              variant: 'primary',
              onClick: () => {
                setShowAlert(false);
                if (pendingMailData) {
                  handleConfirmSend();
                }
              },
              label: '확인',
            },
          ]}
        />
      )}
      {isSuccessModalOpen && (
        <AlertModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            setFormData({
              title: '',
              content: '',
              file: null,
              fileName: '',
            });
            onClose?.();
          }}
          title='전송이 완료되었습니다.'
          buttons={[
            {
              variant: 'primary',
              onClick: () => {
                setIsSuccessModalOpen(false);
                setFormData({
                  title: '',
                  content: '',
                  file: null,
                  fileName: '',
                });
                onClose?.();
              },
              label: '확인',
            },
          ]}
        />
      )}
    </>
  );
};

export default ReplyForm;
