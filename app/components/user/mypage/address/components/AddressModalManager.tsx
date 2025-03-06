'use client';

import { FC } from 'react';
import { AlertModal } from '../../../../common/modals';

interface AddressConfirmAction {
  type: string;
  id: string;
}

interface AddressModalManagerProps {
  modalStore: {
    ModalStates: {
      ADDRESS: {
        address: {
          alert: boolean;
          delete: boolean;
          confirm: boolean;
        };
      };
    };
    toggleState: (state: string) => void;
  };
  handleAddressDeleteConfirm: () => void;
  addressConfirmAction: AddressConfirmAction | null;
  setAddressConfirmAction: (
    action: AddressConfirmAction | null,
  ) => void;
  alertMessage: string;
}

export const AddressModalManager: FC<
  AddressModalManagerProps
> = ({
  modalStore,
  handleAddressDeleteConfirm,
  addressConfirmAction,
  setAddressConfirmAction,
  alertMessage,
}) => (
  <>
    {/* 주소 삭제 모달 */}
    {modalStore.ModalStates.ADDRESS.address.confirm &&
      addressConfirmAction?.type === 'delete' && (
        <AlertModal
          isOpen={
            modalStore.ModalStates.ADDRESS.address.confirm
          }
          onClose={() => {
            modalStore.toggleState(
              'ADDRESS.delete.confirm',
            );
            setAddressConfirmAction(null);
          }}
          title='정보를 삭제하시겠습니까?'
          buttons={[
            {
              variant: 'secondary',
              onClick: () => {
                modalStore.toggleState(
                  'ADDRESS.delete.confirm',
                );
                setAddressConfirmAction(null);
              },
              label: '취소',
            },
            {
              variant: 'primary',
              onClick: handleAddressDeleteConfirm,
              label: '확인',
            },
          ]}
        />
      )}

    {/* 알림 모달 */}
    {modalStore.ModalStates.ADDRESS.address.alert &&
      alertMessage && (
        <AlertModal
          isOpen={
            modalStore.ModalStates.ADDRESS.address.alert
          }
          onClose={() => {
            modalStore.toggleState('ADDRESS.address.alert');
          }}
          title={alertMessage}
          buttons={[
            {
              variant: 'primary',
              onClick: () => {
                modalStore.toggleState(
                  'ADDRESS.address.alert',
                );
              },
              label: '확인',
            },
          ]}
        />
      )}
  </>
);

export default AddressModalManager;
