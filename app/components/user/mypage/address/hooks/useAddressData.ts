'use client';

import { useAddressQuery } from '@/app/hooks/queries/main/mypage/useAddressQuery';
import {
  AddressItemType,
  useAddressStore,
} from '@/app/store/address.store';
import { ChangeEvent, useMemo } from 'react';

interface AddressDataHook {
  addressList: AddressItemType[];
  isLoading: boolean;
  error: unknown;
  total: number;
  totalPages: number;
  sortedAndFilteredList: AddressItemType[];
  handleSort: (field: keyof AddressItemType) => void;
  handleSearch: () => void;
  handlePageSizeChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => void;
  handleApplyPageSize: () => void;
  handlePageChange: (newPage: number) => void;
}

export const useAddressData = (): AddressDataHook => {
  const {
    searchTerm,
    setSearchTerm,
    setCurrentSearchTerm,
    pageNo,
    pageSize,
    tempPageSize,
    setTempPageSize,
    setPageSize,
    setPageNo,
    sortField,
    sortDirection,
    toggleSort,
  } = useAddressStore();

  const {
    addressList: rawAddressList,
    total: serverTotal,
    isLoading,
    error,
  } = useAddressQuery({
    page_no: pageNo,
    page_size: pageSize,
  });

  const addressList = useMemo(
    () =>
      rawAddressList.map((item) => ({
        row_id: item.row_id,
        index: 0,
        hostname: item.hostname,
        id: item.id,
        online: item.online === 1,
        username: item.username,
        alias: item.alias,
        tags: item.tags || [],
      })),
    [rawAddressList],
  );

  // 검색어로 필터링
  const filteredList = useMemo(
    () =>
      addressList.filter((item) =>
        !searchTerm
          ? true
          : item.tags
              ?.join(',')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
      ),
    [addressList, searchTerm],
  );

  const sortedAndFilteredList = useMemo(
    () =>
      filteredList
        .map((item, index) => ({
          ...item,
          index: index + 1,
        }))
        .sort((a, b) => {
          if (!sortField) return 0;

          // null 또는 undefined 값 처리
          const aValue = a[sortField] ?? '';
          const bValue = b[sortField] ?? '';

          // online 필드 특별 처리
          if (sortField === 'online') {
            return sortDirection === 'asc'
              ? Number(a.online) - Number(b.online)
              : Number(b.online) - Number(a.online);
          }

          // 문자열 비교
          if (
            typeof aValue === 'string' &&
            typeof bValue === 'string'
          ) {
            return sortDirection === 'asc'
              ? aValue
                  .toLowerCase()
                  .localeCompare(bValue.toLowerCase())
              : bValue
                  .toLowerCase()
                  .localeCompare(aValue.toLowerCase());
          }

          // 숫자 비교
          if (
            typeof aValue === 'number' &&
            typeof bValue === 'number'
          ) {
            return sortDirection === 'asc'
              ? aValue - bValue
              : bValue - aValue;
          }

          return 0;
        }),
    [filteredList, sortField, sortDirection],
  );

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(serverTotal / pageSize));
  }, [serverTotal, pageSize]);

  const handleSort = (field: keyof AddressItemType) => {
    if (field === sortField) {
      // 같은 필드를 클릭한 경우, 정렬 방향을 토글
      toggleSort(field);
    } else {
      // 다른 필드를 클릭한 경우, 새로운 필드로 설정하고 오름차순으로 시작
      toggleSort(field);
    }
  };

  const handleSearch = () => {
    setCurrentSearchTerm(searchTerm);
    setSearchTerm(searchTerm); // 현재 검색어를 유지
    setPageNo(1); // 검색 시 첫 페이지로 이동
  };

  const handlePageSizeChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value) || 10;
    setTempPageSize(value);
  };

  const handleApplyPageSize = () => {
    setPageSize(tempPageSize);
    setPageNo(1); // 페이지 사이즈 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
  };

  return {
    addressList,
    isLoading,
    error,
    total: serverTotal,
    totalPages,
    sortedAndFilteredList,
    handleSort,
    handleSearch,
    handlePageSizeChange,
    handleApplyPageSize,
    handlePageChange,
  };
};
