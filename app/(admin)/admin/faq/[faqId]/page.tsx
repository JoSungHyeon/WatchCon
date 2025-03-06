'use client';

import styleDetail from '@/app/components/admin/faq/detail/style/Detail.module.css';
import styles from '@/app/components/admin/style/common.module.css';
import { AlertModal } from '@/app/components/common/modals';
import AdminMenu from '@/app/components/layout/AdminMenu';
import { useAdminFaqMutation } from '@/app/hooks/mutations/admin/faq/useAdminFaqMutation';
import {
  useAdminFaqCategoryQuery,
  useAdminFaqDetailQuery,
} from '@/app/hooks/queries/admin/faq/useAdminFaqQuery';
import { useFaqStore } from '@/app/store/faq.store';
import { useModalStore } from '@/app/store/modal.store';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const FaqDetailPage = () => {
  const params = useParams();
  const faqId = params.faqId as string;
  const router = useRouter();

  const { data: faqDetail, isLoading } =
    useAdminFaqDetailQuery({ faqId });
  const { faqEditMode } = useFaqStore();

  const { ModalStates, toggleState } = useModalStore();

  const [subject, setSubject] = useState(
    faqDetail?.subject || '',
  );
  const [content, setContent] = useState(
    faqDetail?.content || '',
  );
  const [selectedCategory, setSelectedCategory] =
    useState<number>(0);
  const [isNotice, setIsNotice] = useState<boolean>(false);

  const { data: categoryData } = useAdminFaqCategoryQuery({
    page_no: 1,
    page_size: 10,
  });

  const { updateFaq } = useAdminFaqMutation();

  useEffect(() => {
    if (faqDetail) {
      console.log('FAQ 데이터 로드:', faqDetail);

      // 기본값 설정
      setSubject(faqDetail.subject || '');
      setContent(faqDetail.content || '');
      setSelectedCategory(
        Number(faqDetail.category_id) || 0,
      );

      // is_notice 처리를 더 명확하게
      const noticeValue = Number(faqDetail.is_notice);
      console.log('공지사항 값 확인:', {
        원본값: faqDetail.is_notice,
        변환값: noticeValue,
        설정될상태: noticeValue === 1,
      });

      setIsNotice(noticeValue === 1);
    }
  }, [faqDetail]);

  const handleSubjectChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (faqEditMode) {
      setSubject(e.target.value);
    }
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (faqEditMode) {
      setContent(e.target.value);
    }
  };

  const handleNoticeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (faqEditMode) {
      setIsNotice(e.target.checked);
    }
  };

  const handleUpdateFaq = () => {
    console.log('현재 선택된 카테고리:', {
      selectedCategory,
      type: typeof selectedCategory,
    });

    console.log('카테고리 목록:', categoryData?.list);

    // 1. 필수값 검증 먼저 실행
    if (!selectedCategory || selectedCategory === 0) {
      console.log('그룹 미선택 상태');
      toggleState('FAQ.select_category');
      return;
    }

    // 2. 카테고리 데이터 유효성 검사
    if (!categoryData?.list?.length) {
      console.log('카테고리 데이터가 없음');
      return;
    }

    // 3. 선택된 카테고리가 유효한지 확인
    const selectedCategoryId = Number(selectedCategory);
    const isValidCategory = categoryData.list.some(
      (category) =>
        Number(category.id) === selectedCategoryId,
    );

    console.log('카테고리 유효성 검사:', {
      선택된카테고리ID: selectedCategoryId,
      유효한카테고리목록: categoryData.list.map((c) =>
        Number(c.id),
      ),
      유효성검사결과: isValidCategory,
    });

    if (!isValidCategory) {
      console.log('유효하지 않은 카테고리');
      toggleState('FAQ.select_category');
      return;
    }

    if (!subject.trim()) {
      console.log('제목 입력 필요');
      toggleState('FAQ.empty_subject');
      return;
    }

    if (!content.trim()) {
      console.log('내용 입력 필요');
      toggleState('FAQ.empty_content');
      return;
    }

    // 4. 변경사항 확인
    if (!faqDetail) {
      console.log('원본 데이터가 없음');
      return;
    }

    const subjectChanged = faqDetail.subject !== subject;
    const contentChanged = faqDetail.content !== content;
    const categoryChanged =
      Number(faqDetail.category_id) !== selectedCategoryId;
    const noticeChanged =
      (faqDetail.is_notice === 1) !== isNotice;

    console.log('필드별 변경사항:', {
      제목: {
        원본: faqDetail.subject,
        현재: subject,
        변경됨: subjectChanged,
      },
      내용: {
        원본: faqDetail.content,
        현재: content,
        변경됨: contentChanged,
      },
      카테고리: {
        원본: faqDetail.category_id,
        현재: selectedCategory,
        변경됨: categoryChanged,
        유효성: isValidCategory,
      },
      공지여부: {
        원본: faqDetail.is_notice,
        현재: isNotice ? 1 : 0,
        변경됨: noticeChanged,
      },
    });

    const hasChanges =
      subjectChanged ||
      contentChanged ||
      categoryChanged ||
      noticeChanged;

    if (!hasChanges) {
      console.log('변경사항 없음');
      toggleState('FAQ.no_changes');
      return;
    }

    // 5. 모든 검증을 통과하면 수정 확인
    console.log('수정 확인 모달 표시');
    toggleState('FAQ.confirm_update');
  };

  const executeUpdate = () => {
    updateFaq.mutate({
      id: Number(faqId),
      subject,
      is_notice: isNotice ? 1 : 0,
      category_id: selectedCategory,
      content,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <AdminMenu />
      <section className={styles.section}>
        <div className={styleDetail.sectionInner}>
          <div className={styleDetail.sectionTop}>
            <div className={styleDetail.menuWrap}>
              <Link href='/admin/faq'>
                <button className={styleDetail.on}>
                  FAQ List
                </button>
              </Link>
              <button>New FAQ</button>
            </div>
          </div>
          <div className={styleDetail.sectionBottom}>
            <div className={styleDetail.detailTitle}>
              <p>제목</p>
              <input
                readOnly={!faqEditMode}
                value={subject}
                onChange={handleSubjectChange}
                type='text'
              />
            </div>
            {faqEditMode && (
              <div className={styles.group}>
                <p>그룹</p>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    console.log('카테고리 선택 변경:', {
                      이전값: selectedCategory,
                      새값: newValue,
                    });
                    setSelectedCategory(newValue);
                  }}
                >
                  <option
                    value={0}
                    className={styles.groupSelect}
                  >
                    그룹을 선택하세요.
                  </option>
                  {categoryData?.list.map((category) => (
                    <option
                      key={category.id}
                      value={Number(category.id)}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className={styleDetail.detailContent}>
              <p>내용</p>
              <textarea
                readOnly={!faqEditMode}
                value={content}
                onChange={handleContentChange}
              />
            </div>
            <div className={styleDetail.detailBottom}>
              {faqEditMode && (
                <>
                  <div className={styleDetail.bottomLeft}>
                    <input
                      type='checkbox'
                      checked={isNotice}
                      onChange={(e) => {
                        if (faqEditMode) {
                          console.log(
                            '체크박스 상태 변경:',
                            {
                              이전상태: isNotice,
                              새상태: e.target.checked,
                            },
                          );
                          setIsNotice(e.target.checked);
                        }
                      }}
                      disabled={!faqEditMode}
                    />
                    <span>메인화면 등록</span>
                  </div>
                </>
              )}
              {faqEditMode ? (
                <div className={styleDetail.bottomRight}>
                  <Link href='/admin/faq'>목록</Link>
                  <button onClick={handleUpdateFaq}>
                    저장
                  </button>
                </div>
              ) : (
                <Link href='/admin/faq'>목록</Link>
              )}
            </div>
          </div>
        </div>
      </section>
      {ModalStates.FAQ.edit_category && (
        <AlertModal
          isOpen={ModalStates.FAQ.edit_category}
          onClose={() => toggleState('FAQ.edit_category')}
          title='수정되었습니다.'
          buttons={[
            {
              label: '확인',
              onClick: () => {
                toggleState('FAQ.edit_category');
                router.push('/admin/faq');
              },
            },
          ]}
        />
      )}
      {ModalStates.FAQ.select_category && (
        <AlertModal
          isOpen={ModalStates.FAQ.select_category}
          onClose={() => toggleState('FAQ.select_category')}
          title='그룹을 선택해주세요.'
          buttons={[
            {
              label: '확인',
              onClick: () =>
                toggleState('FAQ.select_category'),
            },
          ]}
        />
      )}
      {ModalStates.FAQ.no_changes && (
        <AlertModal
          isOpen={ModalStates.FAQ.no_changes}
          onClose={() => toggleState('FAQ.no_changes')}
          title='수정된 내용이 없습니다.'
          buttons={[
            {
              label: '확인',
              onClick: () => toggleState('FAQ.no_changes'),
            },
          ]}
        />
      )}
      {ModalStates.FAQ.confirm_update && (
        <AlertModal
          isOpen={ModalStates.FAQ.confirm_update}
          onClose={() => toggleState('FAQ.confirm_update')}
          title='FAQ를 수정하시겠습니까?'
          buttons={[
            {
              label: '취소',
              onClick: () =>
                toggleState('FAQ.confirm_update'),
            },
            {
              label: '확인',
              onClick: () => {
                toggleState('FAQ.confirm_update');
                executeUpdate();
              },
            },
          ]}
        />
      )}
      ;
    </div>
  );
};

export default FaqDetailPage;
