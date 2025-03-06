'use client';

import { FC } from 'react';
import {
  AlertModal,
  GroupModal,
} from '../../../../common/modals';

interface Tag {
  id: string;
  name: string;
}

interface GroupConfirmAction {
  type: string;
  tagId: string;
  tagName: string;
}

interface GroupModalManagerProps {
  modalStore: {
    ModalStates: {
      ADDRESS: {
        tag: {
          new: boolean;
          edit: boolean;
          delete: boolean;
          alert: boolean;
        };
      };
    };
    toggleState: (state: string) => void;
  };
  selectedTag: Tag | null;
  updatedGroupName: string;
  setUpdatedGroupName: (name: string) => void;
  setGroupActionValue: (value: string) => void;
  handleCreateGroup: (name: string) => void;
  handleUpdateGroup: (name: string) => void;
  handleTagDeleteConfirm: () => void;
  groupConfirmAction: GroupConfirmAction | null;
  setGroupConfirmAction: (
    action: GroupConfirmAction | null,
  ) => void;
  alertMessage: string;
}

export const GroupModalManager: FC<
  GroupModalManagerProps
> = ({
  modalStore,
  selectedTag,
  updatedGroupName,
  setUpdatedGroupName,
  setGroupActionValue,
  handleCreateGroup,
  handleUpdateGroup,
  handleTagDeleteConfirm,
  groupConfirmAction,
  setGroupConfirmAction,
  alertMessage,
}) => (
  <>
    {/* 그룹 생성/수정 모달 */}
    {(modalStore.ModalStates.ADDRESS.tag.new ||
      modalStore.ModalStates.ADDRESS.tag.edit) && (
      <GroupModal
        isOpen={
          modalStore.ModalStates.ADDRESS.tag.new ||
          modalStore.ModalStates.ADDRESS.tag.edit
        }
        onClose={() => {
          if (modalStore.ModalStates.ADDRESS.tag.new) {
            modalStore.toggleState('ADDRESS.tag.new');
          } else {
            modalStore.toggleState('ADDRESS.tag.edit');
          }
          setUpdatedGroupName('');
          setGroupActionValue('action');
        }}
        mode={
          modalStore.ModalStates.ADDRESS.tag.new
            ? 'new'
            : 'edit'
        }
        currentCategoryName={
          modalStore.ModalStates.ADDRESS.tag.new
            ? ''
            : selectedTag?.name || ''
        }
        updatedCategoryName={updatedGroupName}
        onUpdateCategoryName={setUpdatedGroupName}
        buttons={[
          {
            variant: 'secondary',
            onClick: () => {
              if (modalStore.ModalStates.ADDRESS.tag.new) {
                modalStore.toggleState('ADDRESS.tag.new');
              } else {
                modalStore.toggleState('ADDRESS.tag.edit');
              }
              setUpdatedGroupName('');
              setGroupActionValue('action');
            },
            label: '취소',
          },
          {
            variant: 'primary',
            onClick: () => {
              if (modalStore.ModalStates.ADDRESS.tag.new) {
                handleCreateGroup(updatedGroupName);
              } else {
                handleUpdateGroup(updatedGroupName);
              }
            },
            label: '확인',
          },
        ]}
      />
    )}

    {/* 그룹 삭제 모달 */}
    {modalStore.ModalStates.ADDRESS.tag.delete &&
      groupConfirmAction && (
        <AlertModal
          isOpen={modalStore.ModalStates.ADDRESS.tag.delete}
          onClose={() => {
            modalStore.toggleState('ADDRESS.tag.delete');
            setGroupConfirmAction(null);
          }}
          title='그룹을 삭제하시겠습니까?'
          buttons={[
            {
              variant: 'secondary',
              onClick: () => {
                modalStore.toggleState(
                  'ADDRESS.tag.delete',
                );
                setGroupConfirmAction(null);
              },
              label: '취소',
            },
            {
              variant: 'primary',
              onClick: handleTagDeleteConfirm,
              label: '확인',
            },
          ]}
        />
      )}

    {/* 알림 모달 */}
    {modalStore.ModalStates.ADDRESS.tag.alert &&
      alertMessage && (
        <AlertModal
          isOpen={modalStore.ModalStates.ADDRESS.tag.alert}
          onClose={() => {
            modalStore.toggleState('ADDRESS.tag.alert');
          }}
          title={alertMessage}
          buttons={[
            {
              variant: 'primary',
              onClick: () => {
                modalStore.toggleState('ADDRESS.tag.alert');
              },
              label: '확인',
            },
          ]}
        />
      )}
  </>
);

export default GroupModalManager;
