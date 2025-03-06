'use client';

import {
  AlertModal,
  GroupModal,
} from '@/app/components/common/modals';
import { useAdminFaqMutation } from '@/app/hooks/mutations/admin/faq/useAdminFaqMutation';
import { useAdminFaqCategoryQuery } from '@/app/hooks/queries/admin/faq/useAdminFaqQuery';
import { useFaqStore } from '@/app/store/faq.store';
import { useModalStore } from '@/app/store/modal.store';
import { FC, useState } from 'react';
import styles from './style/NewFaq.module.css';

const NewFaq: FC = () => {
  const [group, setGroup] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempPageSize, setTempPageSize] = useState(10);
  const [actualPageSize, setActualPageSize] = useState(10);
  const [subject, setSubject] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<number>(0);
  const [content, setContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [author, setAuthor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategoryName, setCurrentCategoryName] =
    useState('');
  const [updatedCategoryName, setUpdatedCategoryName] =
    useState('');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(0);
  const [selectedActions, setSelectedActions] = useState<
    Record<number, string>
  >({});

  const { setList } = useFaqStore();

  const { ModalStates, toggleState } = useModalStore();
  const { data: categoryData } = useAdminFaqCategoryQuery({
    page_no: currentPage,
    page_size: actualPageSize,
  });
  const {
    createFaq,
    createFaqCategory,
    updateFaqCategory,
    deleteFaqCategory,
  } = useAdminFaqMutation();

  const handleGroup = () => {
    setGroup(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = parseInt(e.target.value);
    setTempPageSize(newSize);
  };

  const handlePageSizeSubmit = () => {
    setCurrentPage(1);
    setActualPageSize(tempPageSize);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFaq.mutateAsync({
        subject,
        is_notice: isNotice ? 1 : 0,
        category_id: selectedCategory,
        content,
      });
      setSubject('');
      setContent('');
      setIsNotice(false);
      setAuthor('');
      setSelectedCategory(0);
      setGroup(true);
      toggleState('FAQ.new');
    } catch (error) {
      console.error('FAQ 생성 실패:', error);
    }
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(e.target.value);
  };

  const handleAction = (
    value: string,
    currentCategoryName: string,
    categoryId: number,
  ) => {
    setSelectedActions((prev) => ({
      ...prev,
      [categoryId]: value,
    }));

    if (value === 'new') {
      toggleState('FAQ.new_category');
    } else if (value === 'edit') {
      setCurrentCategoryName(currentCategoryName);
      setSelectedCategoryId(categoryId);
      toggleState('FAQ.edit_category');
    } else if (value === 'delete') {
      setSelectedCategoryId(categoryId);
      toggleState('FAQ.delete_category');
    }
  };

  const filteredFaqList = categoryData?.list.filter(
    (item) =>
      item.category_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.newFaq}>
      {group ? (
        <form onSubmit={handleSubmit}>
          <div className={styles.newFaqTitle}>
            <p>제목</p>
            <input
              type='text'
              placeholder='제목을 입력하세요.'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className={styles.newFaqGroup}>
            <div className={styles.name}>
              <p>작성자</p>
              <input
                type='text'
                placeholder='작성자를 입력하세요.'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className={styles.group}>
              <p>그룹</p>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    Number(e.target.value),
                  )
                }
              >
                <option
                  value={0}
                  className={styles.groupSelect}
                >
                  그룹을 선택하세요.
                </option>
                {categoryData?.list.map(
                  (category) =>
                    category.category_name.length > 0 && (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.category_name}
                      </option>
                    ),
                )}
              </select>
              <button onClick={handleGroup}>
                그룹 관리
              </button>
            </div>
          </div>
          <div className={styles.newFaqContent}>
            <p>내용</p>
            <textarea
              placeholder='내용을 입력하세요.'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className={styles.newFaqBottom}>
            <div className={styles.bottomLeft}>
              <input
                type='checkbox'
                checked={isNotice}
                onChange={(e) =>
                  setIsNotice(e.target.checked)
                }
              />
              <span>메인화면 등록</span>
            </div>
            <button
              type='submit'
              disabled={
                !subject || !content || !selectedCategory
              }
            >
              저장
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.bottomTop}>
            <div className={styles.searchZone}>
              <input
                type='text'
                name='search'
                value={searchTerm}
                onChange={handleSearch}
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
              <button onClick={handlePageSizeSubmit}>
                조회
              </button>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>그룹명</th>
                <th>작성일</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqList?.map(
                (item, index: number) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.category_name}</td>
                    <td>{item.created_at.split(' ')[0]}</td>
                    <td>
                      <select
                        value={
                          selectedActions[item.id] || ''
                        }
                        onChange={(e) =>
                          handleAction(
                            e.target.value,
                            item.category_name,
                            item.id,
                          )
                        }
                      >
                        <option value=''>Action</option>
                        <option value='edit'>Edit</option>
                        <option value='delete'>
                          Delete
                        </option>
                        <option value='new'>New</option>
                      </select>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button
              className={styles.pagePrev}
              onClick={() =>
                handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
            />
            <div className={styles.pageNumWrap}>
              {Array.from(
                { length: categoryData?.total_page || 1 },
                (_, i) => (
                  <a
                    key={i + 1}
                    href='#'
                    className={
                      currentPage === i + 1 ? styles.on : ''
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </a>
                ),
              )}
            </div>
            <button
              className={styles.pageNext}
              onClick={() =>
                handlePageChange(currentPage + 1)
              }
              disabled={
                currentPage === categoryData?.total_page
              }
            />
            <p>
              Showing{' '}
              <span className={styles.currentNum}>
                {currentPage}
              </span>{' '}
              Of{' '}
              <span className={styles.totalNum}>
                {categoryData?.total_page || 1}
              </span>{' '}
              Pages
            </p>

            <div className={styles.listButtonWrap}>
              <button
                className={styles.listButton}
                onClick={() => {
                  setGroup(true);
                }}
              >
                목록
              </button>
              <button
                className={styles.newButton}
                onClick={() => {
                  toggleState('FAQ.new_category');
                }}
              >
                새그룹생성
              </button>
            </div>
          </div>
        </>
      )}

      {ModalStates.FAQ.new && (
        <AlertModal
          isOpen={ModalStates.FAQ.new}
          onClose={() => {
            toggleState('FAQ.new');
          }}
          title='새로운 FAQ가 추가되었습니다.'
          buttons={[
            {
              label: '확인',
              onClick: () => {
                toggleState('FAQ.new');
                setList('faq');
              },
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.FAQ.new_category && (
        <GroupModal
          isOpen={ModalStates.FAQ.new_category}
          onClose={() => {
            toggleState('FAQ.new_category');
            setUpdatedCategoryName('');
            setSelectedActions((prev) => ({
              ...prev,
              [selectedCategoryId]: '',
            }));
            setSelectedCategoryId(0);
          }}
          mode='new'
          data={categoryData}
          updatedCategoryName={updatedCategoryName}
          onUpdateCategoryName={setUpdatedCategoryName}
          buttons={[
            {
              label: '확인',
              onClick: (inputValue: string) => {
                createFaqCategory.mutateAsync({
                  category_name: inputValue,
                  category_no: 1,
                  admin_id: 1,
                  category_sub_no: 1,
                });
                toggleState('FAQ.new_category');
                setUpdatedCategoryName('');
                toggleState('FAQ.new_category_created');
              },
              variant: 'primary',
            },
            {
              label: '취소',
              onClick: () => {
                toggleState('FAQ.new_category');
                setUpdatedCategoryName('');
              },
              variant: 'secondary',
            },
          ]}
        />
      )}

      {ModalStates.FAQ.new_category_created && (
        <AlertModal
          isOpen={ModalStates.FAQ.new_category_created}
          onClose={() => {
            toggleState('FAQ.new_category_created');
          }}
          title='새로운 FAQ 그룹이 추가되었습니다.'
          buttons={[
            {
              label: '확인',
              onClick: () => {
                toggleState('FAQ.new_category_created');
              },
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.FAQ.edit_category && (
        <GroupModal
          isOpen={ModalStates.FAQ.edit_category}
          onClose={() => {
            toggleState('FAQ.edit_category');
            setSelectedActions((prev) => ({
              ...prev,
              [selectedCategoryId]: '',
            }));
            setSelectedCategoryId(0);
            setUpdatedCategoryName('');
            setCurrentCategoryName('');
          }}
          mode='edit'
          currentCategoryName={currentCategoryName}
          updatedCategoryName={updatedCategoryName}
          onUpdateCategoryName={(value: string) =>
            setUpdatedCategoryName(value)
          }
          buttons={[
            {
              label: '확인',
              onClick: () => {
                updateFaqCategory.mutateAsync({
                  category_name: updatedCategoryName,
                  category_no: 1,
                  category_sub_no: 1,
                  id: selectedCategoryId,
                });
                toggleState('FAQ.edit_category');
                toggleState('FAQ.edit_category_updated');
                setUpdatedCategoryName('');
                setSelectedCategoryId(0);
                setSelectedActions((prev) => ({
                  ...prev,
                  [selectedCategoryId]: '',
                }));
              },
              variant: 'primary',
            },
            {
              label: '취소',
              onClick: () => {
                toggleState('FAQ.edit_category');
                setUpdatedCategoryName('');
                setSelectedActions((prev) => ({
                  ...prev,
                  [selectedCategoryId]: '',
                }));
                setSelectedCategoryId(0);
              },
              variant: 'secondary',
            },
          ]}
        />
      )}

      {ModalStates.FAQ.delete_category && (
        <AlertModal
          isOpen={ModalStates.FAQ.delete_category}
          onClose={() => toggleState('FAQ.delete_category')}
          title='정말로 삭제하시겠습니까?'
          buttons={[
            {
              label: '취소',
              onClick: () =>
                toggleState('FAQ.delete_category'),
              variant: 'secondary',
            },
            {
              label: '확인',
              onClick: () => {
                deleteFaqCategory.mutateAsync(
                  selectedCategoryId,
                );
                toggleState('FAQ.delete_category');
              },
              variant: 'primary',
            },
          ]}
        />
      )}

      {ModalStates.FAQ.edit_category_updated && (
        <AlertModal
          isOpen={ModalStates.FAQ.edit_category_updated}
          onClose={() => {
            toggleState('FAQ.edit_category_updated');
          }}
          title='그룹이 수정되었습니다.'
          buttons={[
            {
              label: '확인',
              onClick: () => {
                toggleState('FAQ.edit_category_updated');
              },
              variant: 'primary',
            },
          ]}
        />
      )}
    </div>
  );
};

export default NewFaq;
