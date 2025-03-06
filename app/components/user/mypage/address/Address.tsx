'use client';

import { useTagQuery } from '@/app/hooks/queries/main/mypage/useTagQuery';
import { useAddressStore } from '@/app/store/address.store';
import { useModalStore } from '@/app/store/modal.store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SideMenu from '../../../layout/SideMenu';
import AddressModalManager from './components/AddressModalManager';
import GroupModalManager from './components/GroupModalManager';
import MobileItem from './components/MobileItem';
import PageSizeSelector from './components/PageSizeSelector';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import WriteForm from './components/WriteForm';
import { useAddressActions } from './hooks/useAddressActions';
import { useAddressData } from './hooks/useAddressData';
import { useGroupActions } from './hooks/useGroupActions';
import styles from './style/Address.module.css';

interface AddressItemType {
  id: string;
  row_id: string;
  alias: string;
  tags: string[];
  // 테이블에 표시되는 다른 필드들도 필요하다면 여기에 추가하세요
}

const Address = () => {
  const { t } = useTranslation('common');
  const [windowWidth, setWindowWidth] = useState(0);
  const [actionStates, setActionStates] = useState<
    Record<string, string>
  >({});
  const [groupActionValue, setGroupActionValue] =
    useState('action');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: t('sideMenu.myInfo'), path: '/mypage/' },
    {
      label: t('sideMenu.licenseInfo'),
      path: '/mypage/license',
    },
    {
      label: t('sideMenu.addressBook'),
      path: '/mypage/address',
    },
  ];

  const modalStore = useModalStore();
  const addressStore = useAddressStore();
  const {
    form,
    setForm,
    searchTerm,
    setSearchTerm,
    tempPageSize,
    pageNo,
    formData,
    resetFormData,
    setFormData,
    setIsEditMode,
  } = addressStore;

  const { tagList, isLoading: isTagLoading } =
    useTagQuery();

  const addressData = useAddressData();

  const {
    handleInputChange,
    handleSubmit,
    handleAddressDelete,
    handleAddressDeleteConfirm,
    addressAlertMessage,
    setAddressAlertMessage,
    addressConfirmAction,
    setAddressConfirmAction,
  } = useAddressActions();

  const {
    selectedTag,
    updatedGroupName,
    setUpdatedGroupName,
    confirmAction: groupConfirmAction,
    setConfirmAction: setGroupConfirmAction,
    handleCreateGroup,
    handleUpdateGroup,
    handleTagDeleteConfirm: handleGroupDeleteConfirm,
    handleGroupAction,
    alertMessage: groupAlertMessage,
  } = useGroupActions(tagList);

  useEffect(() => {
    const handleResize = () =>
      setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  const handleAction = async (
    action: string,
    itemId: string,
  ) => {
    if (action === 'action') {
      return;
    }

    try {
      if (action === 'delete') {
        await handleAddressDelete(itemId);
      } else if (action === 'edit') {
        const itemToEdit =
          addressData.sortedAndFilteredList.find(
            (item) => item.row_id === itemId,
          );
        if (itemToEdit) {
          setFormData({
            id: itemToEdit.id,
            row_id: itemToEdit.row_id,
            alias: itemToEdit.alias,
            tags: itemToEdit.tags,
          });
          setIsEditMode(true);
          setForm('write');
        }
      }

      setActionStates((prev) => ({
        ...prev,
        [itemId]: action,
      }));
    } catch (error) {
      setActionStates((prev) => ({
        ...prev,
        [itemId]: 'action',
      }));
    }
  };

  return (
    <section id={styles.address}>
      {windowWidth >= 1600 && <SideMenu />}
      {windowWidth < 1100 && (
        <div className={styles.mobileMenu}>
          <div
            className={styles.linkTitle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <strong>Address Book</strong>
            <span
              className={`${styles.arrow} ${isMenuOpen ? styles.open : ''}`}
            ></span>
          </div>
          {isMenuOpen && (
            <div className={styles.menuItems}>
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className={styles.menuItem}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      <div className={styles.sectionRight}>
        {form === 'list' ? (
          <div className={styles.addressInner}>
            <div className={styles.listTop}>
              <SearchBar
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                onSearch={addressData.handleSearch}
              />
              <PageSizeSelector
                value={tempPageSize}
                onChange={addressData.handlePageSizeChange}
                onApply={addressData.handleApplyPageSize}
              />
            </div>
            <div className={styles.tableWrap}>
              {windowWidth >= 1100 ? (
                <table>
                  <thead>
                    <TableHeader
                      onSort={addressData.handleSort}
                      sortField={addressStore.sortField}
                      sortDirection={
                        addressStore.sortDirection
                      }
                    />
                  </thead>
                  <tbody>
                    {addressData.sortedAndFilteredList.map(
                      (item) => (
                        <TableRow
                          availableTags={tagList.map(
                            (tag) => tag.name,
                          )}
                          key={item.row_id}
                          item={item}
                          onAction={handleAction}
                          actionState={
                            actionStates[item.id]
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              ) : (
                <div className={styles.tableWrap}>
                  {addressData.sortedAndFilteredList.map(
                    (item) => (
                      <MobileItem
                        key={item.row_id}
                        item={item}
                        onAction={handleAction}
                        actionState={actionStates[item.id]}
                      />
                    ),
                  )}
                </div>
              )}
              <div className={styles.tablePageWrap}>
                {addressData.total > 0 && (
                  <div>
                    <div className={styles.pageLeft}>
                      Showing{' '}
                      <span className={styles.current}>
                        {pageNo}
                      </span>{' '}
                      Of{' '}
                      <span className={styles.total}>
                        {addressData.totalPages}
                      </span>{' '}
                      Pages
                    </div>
                  </div>
                )}
                <Pagination
                  currentPage={pageNo}
                  totalPages={addressData.totalPages}
                  onPageChange={
                    addressData.handlePageChange
                  }
                />
                <div className={styles.pageRight}>
                  <button
                    onClick={() => {
                      setForm('write');
                      resetFormData();
                      setGroupActionValue('action');
                    }}
                  >
                    {t('myPage.address.new')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <WriteForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setForm('list')}
            groupActionValue={groupActionValue}
            onGroupAction={(action) =>
              handleGroupAction(action)
            }
            isTagLoading={isTagLoading}
            tagList={tagList}
            isPending={false}
          />
        )}
      </div>
      <GroupModalManager
        modalStore={modalStore}
        selectedTag={selectedTag}
        updatedGroupName={updatedGroupName}
        setUpdatedGroupName={setUpdatedGroupName}
        setGroupActionValue={setGroupActionValue}
        handleCreateGroup={handleCreateGroup}
        handleUpdateGroup={handleUpdateGroup}
        handleTagDeleteConfirm={handleGroupDeleteConfirm}
        groupConfirmAction={groupConfirmAction}
        setGroupConfirmAction={setGroupConfirmAction}
        alertMessage={groupAlertMessage}
      />
      <AddressModalManager
        modalStore={modalStore}
        handleAddressDeleteConfirm={
          handleAddressDeleteConfirm
        }
        addressConfirmAction={addressConfirmAction}
        setAddressConfirmAction={setAddressConfirmAction}
        alertMessage={addressAlertMessage}
      />
    </section>
  );
};

export default Address;
