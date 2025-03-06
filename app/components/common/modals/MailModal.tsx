'use client';

import { useModalStore } from '@/app/store/modal.store';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import x from '../../../../public/img/modal/x.svg';
import {
  useContactFileMutation,
  useContactMutation,
} from '../../../hooks/mutations/contact/useContactMutation';
import { useRequestMutation } from '../../../hooks/mutations/request/useRequestMutation';
import {
  MailPayload,
  useContactStore,
} from '../../../store/contact.store';
import { AlertModal } from './index';
import styles from './style/MailModal.module.css';

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// EmailEditor 타입 정의 추가
interface EmailEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly: boolean;
  onReady: (editor: any) => void;
}

// EmailEditor 동적 임포트 수정
const EmailEditor = dynamic<EmailEditorProps>(
  () => import('../../layout/EmailEditor'),
  {
    ssr: false,
    loading: () => <p>로딩중...</p>,
  },
);

// 파일 업로드 응답 타입 정의 추가
interface FileUploadResponse {
  message: string;
  url_file: string;
}

export const MailModal = ({
  isOpen,
  onClose,
  title,
}: MailModalProps) => {
  const {
    formData,
    setFormData,
    selectedFile,
    setSelectedFile,
    fileName,
    setFileName,
  } = useContactStore();

  const modalStore = useModalStore();

  const [alertTitle, setAlertTitle] = useState('');

  const mutation = useContactMutation(() => {
    console.log('success');
  });

  const fileMutation = useContactFileMutation(() => {
    console.log('success');
  });

  const { createRequest } = useRequestMutation(() => {
    console.log('request success');
  });

  const [preview, setPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [requestType, setRequestType] = useState<number>(1);

  const resetForm = () => {
    setFormData({
      subject: '',
      username: '',
      email: '',
      reciver: '',
      message: '',
    });
    setSelectedFile(null);
    setFileName('');
  };

  // useEffect 추가
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = 'unset';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = 'unset';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    if (preview) {
      // 미리보기 모드 종료 시 약간의 지연을 주어 에디터가 정리될 시간을 줍니다
      setTimeout(() => {
        setPreview(false);
      }, 100);
    } else {
      setPreview(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      [name]: value,
    } as Partial<typeof formData>);
  };

  const handleReciverChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    handleChange(e);

    // 수신인 선택에 따라 request_type 설정
    if (value === '1')
      setRequestType(2); // 기술지원
    else if (value === '2')
      setRequestType(1); // 구매문의
    else if (value === '3') setRequestType(0); // 기타문의
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 하나라도 입력 안한다면 예외처리
    if (
      !formData.subject ||
      !formData.username ||
      !formData.email ||
      !formData.reciver ||
      !formData.message
    ) {
      setAlertTitle('모든 정보를 입력해 주세요.');
      modalStore.toggleState('WATCHCON.alert');
      return;
    }

    try {
      let fileUrl = '';

      // Ftp API로 전송하고 응답 받기
      if (selectedFile) {
        const fileResponse =
          (await fileMutation.mutateAsync({
            file: selectedFile,
          } as MailPayload)) as unknown as FileUploadResponse;

        fileUrl = fileResponse.url_file || '';
        if (!fileUrl) {
          console.error(
            '파일 URL을 받아오지 못했습니다:',
            fileResponse,
          );
          throw new Error(
            '파일 업로드 응답이 올바르지 않습니다.',
          );
        }
      }

      // Contact_us API로 전송
      await mutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        subject: formData.subject,
        reciver: Number(formData.reciver),
        message: formData.message,
      });

      // createRequest에 file_url 포함하여 전송
      await createRequest.mutate({
        title: formData.subject,
        content: formData.message,
        file_yn: selectedFile ? 'Y' : 'N', // 파일 존재 여부에 따라 'Y' 또는 'N'
        file_name: selectedFile ? fileUrl : 'N', // 파일이 있으면 fileUrl, 없으면 'N'
        reply_yn: 'N',
        request_type: requestType,
        request_name: formData.username,
        request_email: formData.email,
      });

      // 성공 메시지 표시
      setAlertTitle('메일이 성공적으로 전송되었습니다.');
      modalStore.toggleState('WATCHCON.alert');
    } catch (error: any) {
      console.error('전송 실패:', error);
      if (error.response?.status === 400) {
        setAlertTitle(
          '필수 항목이 누락되었습니다: Name, email, reciver, and message are required.',
        );
      } else {
        setAlertTitle(
          '전송에 실패했습니다. 다시 시도해주세요.',
        );
      }
      modalStore.toggleState('WATCHCON.alert');
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // preview 모드에서 메시지 표시 부분 수정
  const renderMessageInput = () => {
    if (preview) {
      return (
        <div className={styles.formMessage}>
          <p>메시지</p>
          <div
            className={styles.previewContent}
            dangerouslySetInnerHTML={{
              __html: formData.message,
            }}
          />
        </div>
      );
    }

    return (
      <div className={styles.formMessage}>
        <p>메시지</p>
        <div>
          <EmailEditor
            value={formData.message}
            onChange={(content: string) => {
              console.log('onChange content:', content);
              setFormData({
                message: content,
              });
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
                  console.log(
                    'text-change content:',
                    content,
                  );
                  setFormData({
                    message: content,
                  });
                },
              );
            }}
          />
        </div>
      </div>
    );
  };

  const [quill, setQuill] = useState<any>(null);

  const handleEditorReady = (editor: any) => {
    setQuill(editor);
  };

  const getContent = () => {
    if (quill) {
      const content = quill.root.innerHTML;
      console.log('에디터 내용:', content);
    }
  };

  return (
    <div
      className={styles.mailModalOverlay}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div className={styles.mailModal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <Image
            src={x}
            alt='close'
            width={20}
            height={20}
          />
        </button>

        <div className={styles.modalContent}>
          {preview === false ? (
            <>
              <h2 className={styles.modalTitle}>{title}</h2>
              <div className={styles.modalBody}>
                <form
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  <div className={styles.formTop}>
                    <div className={styles.formTitle}>
                      <p>제목</p>
                      <input
                        type='text'
                        name='subject'
                        placeholder='제목을 입력하세요.'
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formTitle}>
                      <p>사용자 이름</p>
                      <input
                        type='text'
                        name='username'
                        placeholder='이름을 입력하세요.'
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formTitle}>
                      <p>이메일</p>
                      <input
                        type='email'
                        name='email'
                        placeholder='이메일을 입력하세요.'
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formFile}>
                      <p>첨부파일</p>
                      <div className={styles.fileWrap}>
                        <button
                          type='button'
                          onClick={handleFileClick}
                        >
                          파일 찾기
                        </button>
                        <input
                          type='text'
                          value={fileName}
                          placeholder='선택된 파일이 없습니다.'
                          readOnly
                        />
                        <input
                          type='file'
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    <div className={styles.Recipient}>
                      <p>수신인</p>
                      <select
                        name='reciver'
                        value={formData.reciver}
                        onChange={handleReciverChange}
                      >
                        <option value=''>
                          수신인을 선택하세요.
                        </option>
                        <option value='1'>기술지원</option>
                        <option value='2'>구매문의</option>
                        <option value='3'>기타문의</option>
                      </select>
                    </div>
                    {renderMessageInput()}
                  </div>
                  <div className={styles.modalBottom}>
                    <div className={styles.buttonContainer}>
                      <button
                        onClick={handlePreview}
                        className={styles.preview}
                      >
                        미리보기
                      </button>
                      <button
                        type='submit'
                        className={styles.send}
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending
                          ? '전송 중...'
                          : '메일 보내기'}
                      </button>
                    </div>
                  </div>
                </form>
                {mutation.error && (
                  <p className={styles.error}>
                    메일 전송에 실패했습니다. 다시
                    시도해주세요.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.modalTitle}>
                미리보기
              </h2>
              <div className={styles.modalBody}>
                <form action='' className={styles.form}>
                  <div className={styles.formTop}>
                    <div className={styles.formTitle}>
                      <p>제목</p>
                      <input
                        type='text'
                        value={formData.subject}
                        readOnly
                      />
                    </div>
                    <div className={styles.formTitle}>
                      <p>사용자 이름</p>
                      <input
                        type='text'
                        value={formData.username}
                        readOnly
                      />
                    </div>
                    <div className={styles.formTitle}>
                      <p>이메일</p>
                      <input
                        type='email'
                        value={formData.email}
                        readOnly
                      />
                    </div>
                    <div className={styles.formFile}>
                      <p>첨부파일</p>
                      <div className={styles.fileWrap}>
                        <input
                          type='text'
                          value={
                            fileName ||
                            '선택된 파일이 없습니다.'
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className={styles.Recipient}>
                      <p>수신인</p>
                      <input
                        type='text'
                        value={
                          formData.reciver === '1'
                            ? '기술지원'
                            : formData.reciver === '2'
                              ? '구매문의'
                              : formData.reciver === '3'
                                ? '기타문의'
                                : ''
                        }
                        readOnly
                      />
                    </div>
                    {renderMessageInput()}
                  </div>
                  <div className={styles.modalBottom}>
                    <div className={styles.buttonContainer}>
                      <button
                        onClick={handlePreview}
                        className={styles.send}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {modalStore.ModalStates.WATCHCON.alert && (
        <AlertModal
          isOpen={modalStore.ModalStates.WATCHCON.alert}
          onClose={() => {
            modalStore.toggleState('WATCHCON.alert');
            resetForm();
            onClose();
          }}
          title={alertTitle}
          buttons={[
            {
              variant: 'primary',
              onClick: () => {
                modalStore.toggleState('WATCHCON.alert');
                resetForm();
                onClose();
              },
              label: '확인',
            },
          ]}
        />
      )}
    </div>
  );
};
