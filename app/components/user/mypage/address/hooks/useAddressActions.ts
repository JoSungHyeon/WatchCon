'use client';

import {
  useAddressCreateMutation,
  useAddressDeleteMutation,
  useAddressUpdateMutation,
} from '@/app/hooks/mutations/mypage/useAddressMutation';
import { useAddressQuery } from '@/app/hooks/queries/main/mypage/useAddressQuery';
import { useAddressStore } from '@/app/store/address.store';
import { useAuthStore } from '@/app/store/auth.store';
import { useModalStore } from '@/app/store/modal.store';
import { useEffect, useRef, useState } from 'react';

interface BaseConfirmAction {
  type: string;
}

interface AddressConfirmAction extends BaseConfirmAction {
  id: string;
}

interface AddressActionsHook {
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: () => Promise<void>;
  handleAddressDelete: (id: string) => Promise<void>;
  addressAlertMessage: string;
  setAddressAlertMessage: (message: string) => void;
  addressConfirmAction: AddressConfirmAction | null;
  setAddressConfirmAction: (
    action: AddressConfirmAction | null,
  ) => void;
  handleAddressDeleteConfirm: () => Promise<void>;
}

export const useAddressActions = (): AddressActionsHook => {
  const [addressAlertMessage, setAddressAlertMessage] =
    useState('');
  const [addressConfirmAction, setAddressConfirmAction] =
    useState<AddressConfirmAction | null>(null);
  const {
    setForm,
    formData,
    setFormData,
    resetFormData,
    isEditMode,
    setIsEditMode,
  } = useAddressStore();
  const { userInfo } = useAuthStore();
  const modalStore = useModalStore();
  const createMutation = useAddressCreateMutation();
  const deleteMutation = useAddressDeleteMutation();
  const updateMutation = useAddressUpdateMutation();
  const { addressList } = useAddressQuery();

  // 모달이 닫힐 때 alertMessage 초기화
  const prevModalState = useRef(false);

  useEffect(() => {
    const currentModalState =
      modalStore.ModalStates?.['ADDRESS.address.alert'];

    // 이전 상태가 true이고 현재 상태가 false일 때만 실행 (모달이 닫힐 때)
    if (prevModalState.current && !currentModalState) {
      setAddressAlertMessage(''); // alertMessage 초기화
    }

    prevModalState.current = !!currentModalState;
  }, [modalStore.ModalStates]);

  const showAlert = (message: string) => {
    setAddressAlertMessage(message);
    modalStore.toggleState('ADDRESS.address.alert');
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData({ [name]: [value] });
    } else {
      setFormData({ [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.alias || !formData.tags?.length) {
        showAlert('필수 정보를 모두 입력해주세요.');
        return;
      }

      if (!formData.id?.trim()) {
        showAlert('아이디를 입력해주세요.');
        return;
      }

      // 아이디 중복 체크 (수정 모드가 아닐 때만)
      if (!isEditMode) {
        const isDuplicate = addressList?.some(
          (address) => address.id === formData.id,
        );

        if (isDuplicate) {
          showAlert('이미 사용 중인 아이디입니다.');
          return;
        }
      }

      if (isEditMode) {
        // 수정 모드
        console.log('Updating with formData:', formData);
        await updateMutation.mutateAsync({
          row_id: formData.row_id,
          alias: formData.alias,
          hostname: window.location.hostname,
          id: formData.id,
          platform: navigator.platform || 'Unknown',
          tags: formData.tags,
          username: userInfo.userName,
        });
      } else {
        // 새로운 등록 모드
        await createMutation.mutateAsync({
          alias: formData.alias,
          hostname: window.location.hostname,
          id: formData.id,
          platform: navigator.platform || 'Unknown',
          tags: formData.tags,
          username: userInfo.userName,
        });
      }

      setForm('list');
      setIsEditMode(false);
      resetFormData();
      showAlert(
        isEditMode
          ? '정보가 수정되었습니다'
          : '정보가 등록되었습니다',
      );
    } catch (error) {
      console.error('Address action failed:', error);
      showAlert(
        isEditMode
          ? '주소 수정에 실패했습니다. 다시 시도해주세요.'
          : '주소 등록에 실패했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleAddressDelete = async (id: string) => {
    console.log('Delete button clicked for id:', id);
    setAddressConfirmAction({
      type: 'delete',
      id,
    });
    modalStore.toggleState('ADDRESS.address.confirm');
  };

  const handleAddressDeleteConfirm = async () => {
    console.log('Delete confirmation triggered');
    if (!addressConfirmAction) {
      console.log('No address action found');
      return;
    }

    try {
      console.log(
        'Deleting address:',
        addressConfirmAction.id,
      );
      await deleteMutation.mutateAsync(
        addressConfirmAction.id,
      );
      modalStore.toggleState('ADDRESS.address.confirm');
      setAddressConfirmAction(null);

      // 삭제 성공 메시지 표시
      showAlert('정보가 삭제되었습니다');
    } catch (error) {
      console.error('Address delete failed:', error);
      modalStore.toggleState('ADDRESS.address.confirm');
      setAddressConfirmAction(null);
      showAlert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    handleInputChange,
    handleSubmit,
    handleAddressDelete,
    handleAddressDeleteConfirm,
    addressAlertMessage,
    setAddressAlertMessage,
    addressConfirmAction,
    setAddressConfirmAction,
  };
};

export default useAddressActions;
