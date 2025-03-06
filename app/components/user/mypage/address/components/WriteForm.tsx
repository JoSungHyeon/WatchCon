'use client';

import { useAddressStore } from '@/app/store/address.store'; // Import useAddressStore hook
import { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../style/Address.module.css';

interface Tag {
  id: string;
  name: string;
}

interface FormData {
  id: string;
  tags: string[];
  alias: string;
}

interface WriteFormProps {
  formData: FormData;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
  groupActionValue: string;
  onGroupAction: (action: string) => void;
  isTagLoading: boolean;
  tagList: Tag[];
  isPending: boolean;
}

export const WriteForm: FC<WriteFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  groupActionValue,
  onGroupAction,
  isTagLoading,
  tagList,
  isPending,
}) => {
  const { isEditMode, setIsEditMode } = useAddressStore(); // setIsEditMode도 가져옵니다
  const { t } = useTranslation('common');

  const handleCancel = () => {
    setIsEditMode(false); // 취소 시 editMode를 false로 설정
    onCancel();
  };

  return (
    <div className={styles.writeInner}>
      <h2>
        {isEditMode
          ? t('myPage.address.editText')
          : t('myPage.address.writeText')}
      </h2>
      <div className={styles.writeInfo}>
        <div>
          <div className={styles.groupName}>그룹 이름</div>
          <div className={styles.groupSelect}>
            <select
              name='tags'
              value={formData.tags?.[0] || ''}
              onChange={onInputChange}
            >
              <option value=''>그룹을 선택하세요</option>
              {isTagLoading ? (
                <option>Loading...</option>
              ) : (
                tagList.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))
              )}
            </select>
            <select
              onChange={(e) => {
                onGroupAction(e.target.value);
              }}
              value={groupActionValue}
            >
              <option value='action'>Action</option>
              <option value='add'>Add</option>
              <option value='edit'>Edit</option>
              <option value='delete'>Delete</option>
            </select>
          </div>
        </div>
        <div>
          <div className={styles.name}>이름</div>
          <input
            type='text'
            name='alias'
            value={formData.alias}
            onChange={onInputChange}
          />
        </div>
        <div>
          <div className={styles.id}>WatchCon ID</div>
          <input
            type='text'
            name='id'
            value={formData.id}
            onChange={onInputChange}
            className={styles.userId}
            readOnly={isEditMode ? true : false}
          />
        </div>
      </div>
      <div className={styles.btnWrap}>
        <button
          className={styles.cancel}
          onClick={handleCancel}
        >
          {t('myPage.address.cancel')}
        </button>
        <button
          className={styles.save}
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending
            ? '저장 중...'
            : t('myPage.address.save')}
        </button>
      </div>
    </div>
  );
};

export default WriteForm;
