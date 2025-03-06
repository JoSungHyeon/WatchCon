'use client';

import {
  useTagCreateMutation,
  useTagDeleteMutation,
  useTagUpdateMutation,
} from '@/app/hooks/mutations/mypage/useTagMutation';
import { useAddressStore } from '@/app/store/address.store';
import { useModalStore } from '@/app/store/modal.store';
import { useState } from 'react';

interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: number;
  collection_id: number;
  created_at: string;
  updated_at: string;
}

interface BaseConfirmAction {
  type: string;
}

interface GroupConfirmAction extends BaseConfirmAction {
  tagId: string;
  tagName: string;
}

interface GroupActionsHook {
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag | null) => void;
  updatedGroupName: string;
  setUpdatedGroupName: (name: string) => void;
  confirmAction: GroupConfirmAction | null;
  setConfirmAction: (
    action: GroupConfirmAction | null,
  ) => void;
  handleCreateGroup: (name: string) => Promise<void>;
  handleUpdateGroup: (name: string) => Promise<void>;
  handleTagDeleteConfirm: () => Promise<void>;
  handleGroupAction: (
    action: string,
    itemId?: string,
  ) => Promise<void>;
  alertMessage: string;
  setAlertMessage: (message: string) => void;
}

export const useGroupActions = (
  tagList: Tag[],
): GroupActionsHook => {
  const [selectedTag, setSelectedTag] =
    useState<Tag | null>(null);
  const [updatedGroupName, setUpdatedGroupName] =
    useState('');
  const [confirmAction, setConfirmAction] =
    useState<GroupConfirmAction | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const modalStore = useModalStore();
  const { formData, setFormData } = useAddressStore();

  const createTagMutation = useTagCreateMutation();
  const updateTagMutation = useTagUpdateMutation();
  const deleteTagMutation = useTagDeleteMutation();

  const handleCreateGroup = async (name: string) => {
    if (!name?.trim()) {
      setAlertMessage('그룹 이름을 입력해주세요.');
      modalStore.toggleState('ADDRESS.tag.alert');
      return;
    }

    const trimmedName = name.trim();
    if (tagList.some((tag) => tag.name === trimmedName)) {
      setAlertMessage('동일한 그룹명이 존재합니다');
      modalStore.toggleState('ADDRESS.tag.alert');
      return;
    }

    try {
      await createTagMutation.mutateAsync({
        name: trimmedName,
      });
      setFormData({ tags: [trimmedName] });
      modalStore.toggleState('ADDRESS.tag.new');
      setUpdatedGroupName('');
      setTimeout(() => {
        setAlertMessage('그룹이 생성되었습니다');
        modalStore.toggleState('ADDRESS.tag.alert');
      }, 100);
    } catch (error) {
      modalStore.toggleState('ADDRESS.tag.new');
      setUpdatedGroupName('');
      setTimeout(() => {
        setAlertMessage(
          '그룹 생성에 실패했습니다. 다시 시도해주세요.',
        );
        modalStore.toggleState('ADDRESS.tag.alert');
      }, 100);
    }
  };

  const handleUpdateGroup = async (newName: string) => {
    if (!selectedTag) return;
    if (!newName?.trim()) {
      setAlertMessage('그룹 이름을 입력해주세요.');
      modalStore.toggleState('ADDRESS.tag.alert');
      return;
    }

    const trimmedName = newName.trim();
    if (
      tagList.some(
        (tag) =>
          tag.name === trimmedName &&
          tag.id !== selectedTag.id,
      )
    ) {
      setAlertMessage('동일한 그룹명이 존재합니다');
      modalStore.toggleState('ADDRESS.tag.alert');
      return;
    }

    try {
      console.log('Selected tag:', selectedTag);
      const updateData = {
        id: selectedTag.id,
        name: trimmedName,
      };
      console.log('Tag update request:', updateData);
      await updateTagMutation.mutateAsync(updateData);
      setFormData({ tags: [trimmedName] });
      modalStore.toggleState('ADDRESS.tag.edit');
      setUpdatedGroupName('');
      setSelectedTag(null);
      setTimeout(() => {
        setAlertMessage('그룹명이 수정되었습니다');
        modalStore.toggleState('ADDRESS.tag.alert');
      }, 100);
    } catch (error) {
      modalStore.toggleState('ADDRESS.tag.edit');
      setUpdatedGroupName('');
      setSelectedTag(null);
      setTimeout(() => {
        setAlertMessage(
          '그룹 수정에 실패했습니다. 다시 시도해주세요.',
        );
        modalStore.toggleState('ADDRESS.tag.alert');
      }, 100);
    }
  };

  const handleTagDeleteConfirm = async () => {
    if (!confirmAction) return;

    try {
      await deleteTagMutation.mutateAsync({
        id: confirmAction.tagId,
      });
      modalStore.toggleState('ADDRESS.tag.delete');
      setConfirmAction(null);
      setTimeout(() => {
        setAlertMessage('그룹이 삭제되었습니다');
        modalStore.toggleState('ADDRESS.tag.alert');
      }, 100);
    } catch (error) {
      modalStore.toggleState('ADDRESS.tag.delete');
      setConfirmAction(null);
      setTimeout(() => {
        setAlertMessage(
          '삭제에 실패했습니다. 다시 시도해주세요.',
        );
        modalStore.toggleState('ADDRESS.tag.alert');
      }, 100);
    }
  };

  const handleGroupAction = async (
    action: string,
    itemId?: string,
  ) => {
    if (!itemId) {
      if (action === 'action') return;

      const selectedGroup = tagList.find(
        (tag) => tag.name === formData.tags?.[0],
      );

      switch (action) {
        case 'add':
          setUpdatedGroupName('');
          modalStore.toggleState('ADDRESS.tag.new');
          break;
        case 'edit':
          if (!selectedGroup && tagList.length > 0) {
            setFormData({ tags: [tagList[0].name] });
            setSelectedTag(tagList[0]);
          } else if (selectedGroup) {
            setSelectedTag(selectedGroup);
          }
          setUpdatedGroupName('');
          modalStore.toggleState('ADDRESS.tag.edit');
          break;
        case 'delete':
          if (selectedGroup) {
            setConfirmAction({
              type: 'delete',
              tagId: selectedGroup.id,
              tagName: selectedGroup.name,
            });
            modalStore.toggleState('ADDRESS.tag.delete');
          }
          break;
      }
      return;
    }

    // itemId가 있을 때는 해당 ID로 직접 찾기
    console.log('Received itemId:', itemId);
    console.log('Received action:', action);
    const selectedGroup = tagList.find(
      (tag) => tag.id === itemId,
    );
    console.log('Found selectedGroup:', selectedGroup);
    if (!selectedGroup) return;

    if (action === 'edit') {
      console.log('Executing edit action');
      setSelectedTag(selectedGroup);
      setUpdatedGroupName('');
      modalStore.toggleState('ADDRESS.tag.edit');
    } else if (action === 'delete') {
      setConfirmAction({
        type: 'delete',
        tagId: selectedGroup.id,
        tagName: selectedGroup.name,
      });
      modalStore.toggleState('ADDRESS.tag.delete');
    }
  };

  return {
    selectedTag,
    setSelectedTag,
    updatedGroupName,
    setUpdatedGroupName,
    confirmAction,
    setConfirmAction,
    handleCreateGroup,
    handleUpdateGroup,
    handleTagDeleteConfirm,
    handleGroupAction,
    alertMessage,
    setAlertMessage,
  };
};

export default useGroupActions;
