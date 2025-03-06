// import EmailEditor from '@/app/components/layout/EmailEditor';
import { useNoticeMutation } from '@/app/hooks/mutations/admin/notice/useNoticeMutation';
import { useNoticeQuery } from '@/app/hooks/queries/admin/notice/useNoticeQuery';
import { useNoticeStore } from '@/app/store/notice.store';
import { NoticeRequestDto } from '@/app/types/dto/notice/request.dto';
import dynamic from 'next/dynamic';
import { FC, useEffect, useState } from 'react';
import styles from './style/NewNotice.module.css';

type NoticeForm = NoticeRequestDto['LIST']['POST'];

type NoticeEditForm = NoticeRequestDto['LIST']['UPDATE'];

interface EmailEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly: boolean;
  onReady: (editor: any) => void;
}

// dynamic import를 좀 더 명확하게 타입 지정
const EmailEditor = dynamic(
  () =>
    import('../../layout/EmailEditor').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <p>로딩중...</p>,
  },
) as React.ComponentType<EmailEditorProps>;

const initialNoticeState: NoticeForm = {
  is_notice_pop: 0,
  is_notice_mail: 0,
  title: '',
  content: '',
  category_no: 0,
};

interface NewNoticeProps {
  list: string;
  setList: (value: string) => void;
  setQuill: (editor: any) => void;
}

const NewNotice: FC<NewNoticeProps> = ({
  list,
  setList,
  setQuill,
}) => {
  const { postNotice, updateNotice } = useNoticeMutation();
  const { selectedNoticeId } = useNoticeStore();
  const { noticeDetail } = useNoticeQuery({
    id: selectedNoticeId,
    list: list,
  });
  const [formData, setFormData] = useState<NoticeForm>(
    initialNoticeState,
  );

  const [editFormData, setEditFormData] =
    useState<NoticeEditForm>({
      is_notice_pop: 0,
      is_notice_mail: 0,
      title: '',
      content: '',
      id: selectedNoticeId,
    });

  useEffect(() => {
    if (noticeDetail && list === 'edit') {
      setEditFormData({
        is_notice_pop: noticeDetail.is_notice_pop,
        is_notice_mail: noticeDetail.is_notice_mail,
        title: noticeDetail.title,
        content: noticeDetail.content,
        id: selectedNoticeId,
      });
    }
  }, [noticeDetail, list]);

  const handleChange = (
    name: keyof NoticeForm,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (
    name: keyof NoticeEditForm,
    value: string | number,
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostNotice = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    postNotice(formData);
    setList('list');
    setFormData(initialNoticeState);
  };

  const renderMessageInput = () => {
    if (list === 'details') {
      return (
        <div className={styles.formMessage}>
          <div
            className={styles.previewContent}
            dangerouslySetInnerHTML={{
              __html: noticeDetail?.content,
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <div>
          <EmailEditor
            value={
              list === 'edit'
                ? editFormData.content
                : formData.content
            }
            onChange={(content: string) => {
              if (list === 'edit') {
                setEditFormData((prev) => ({
                  ...prev,
                  content: content,
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  content: content,
                }));
              }
            }}
            readOnly={list === 'details'}
            onReady={(editor: any) => {
              setQuill(editor);
              if (list === 'edit' && editFormData.content) {
                editor.root.innerHTML =
                  editFormData.content;
              }
              editor.on(
                'text-change',
                (
                  delta: any,
                  oldContents: any,
                  source: any,
                ) => {
                  const content = editor.root.innerHTML;
                  if (list === 'edit') {
                    setEditFormData((prev) => ({
                      ...prev,
                      content: content,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      content: content,
                    }));
                  }
                },
              );
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <form action='' className={styles.form}>
        <header>
          <div className={styles.inputWrap}>
            <input
              type='checkbox'
              checked={
                list === 'new'
                  ? formData.is_notice_pop === 1
                  : list === 'edit'
                    ? editFormData.is_notice_pop === 1
                    : noticeDetail?.is_notice_pop === 1 ||
                      false
              }
              onChange={() =>
                list === 'new'
                  ? handleChange(
                      'is_notice_pop',
                      formData.is_notice_pop === 1 ? 0 : 1,
                    )
                  : list === 'edit'
                    ? handleEditChange(
                        'is_notice_pop',
                        editFormData.is_notice_pop === 1
                          ? 0
                          : 1,
                      )
                    : undefined
              }
              readOnly={list === 'details'}
            />
            <span>팝업 공지</span>
          </div>
          <div className={styles.inputWrap}>
            <input
              type='checkbox'
              checked={
                list === 'new'
                  ? formData.is_notice_mail === 1
                  : list === 'edit'
                    ? editFormData.is_notice_mail === 1
                    : noticeDetail?.is_notice_mail === 1 ||
                      false
              }
              onChange={() =>
                list === 'new'
                  ? handleChange(
                      'is_notice_mail',
                      formData.is_notice_mail === 1 ? 0 : 1,
                    )
                  : list === 'edit'
                    ? handleEditChange(
                        'is_notice_mail',
                        editFormData.is_notice_mail === 1
                          ? 0
                          : 1,
                      )
                    : undefined
              }
              readOnly={list === 'details'}
            />
            <span>사용자 전체 메일 공지</span>
          </div>
        </header>
        <div className={styles.formTitle}>
          <p>제목</p>
          <input
            type='text'
            placeholder='제목을 입력하세요.'
            value={
              list === 'new'
                ? formData.title
                : list === 'edit'
                  ? editFormData.title
                  : noticeDetail?.title || ''
            }
            onChange={(e) =>
              list === 'new'
                ? handleChange('title', e.target.value)
                : list === 'edit'
                  ? handleEditChange(
                      'title',
                      e.target.value,
                    )
                  : undefined
            }
            readOnly={list === 'details'}
          />
        </div>
        <div className={styles.formContent}>
          <p>내용</p>
          {renderMessageInput()}
          {/* <textarea
            placeholder='내용을 입력하세요.'
            value={
              list === 'new'
                ? formData.content
                : list === 'edit'
                  ? editFormData.content
                  : noticeDetail?.content || ''
            }
            onChange={(e) =>
              list === 'new'
                ? handleChange('content', e.target.value)
                : list === 'edit'
                  ? handleEditChange(
                      'content',
                      e.target.value,
                    )
                  : undefined
            }
            readOnly={list === 'details'}
          /> */}
        </div>
        {list === 'new' ? (
          <button
            type='button'
            onClick={handlePostNotice}
            disabled={!formData.title || !formData.content}
          >
            등록
          </button>
        ) : list === 'details' ? (
          <button
            onClick={() => {
              setList('list');
            }}
          >
            목록
          </button>
        ) : (
          <button
            onClick={() => {
              updateNotice(editFormData);
              setList('list');
            }}
          >
            수정
          </button>
        )}
      </form>
    </>
  );
};

export default NewNotice;
