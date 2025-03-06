'use client';

import { AlertModal } from '@/app/components/common/modals';
import { useAdminFaqMutation } from '@/app/hooks/mutations/admin/faq/useAdminFaqMutation';
import { useModalStore } from '@/app/store/modal.store';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FaqTable from '../../../components/admin/faq/FaqTable';
import NewFaq from '../../../components/admin/faq/NewFaq';
import stylesB from '../../../components/admin/faq/style/Faq.module.css';
import stylesA from '../../../components/admin/style/common.module.css';
import AdminMenu from '../../../components/layout/AdminMenu';
import { useAdminFaqQuery } from '../../../hooks/queries/admin/faq/useAdminFaqQuery';
import { useFaqStore } from '../../../store/faq.store';

const FaqPage: React.FC = () => {
  const { toggleState, ModalStates } = useModalStore();
  const {
    tempStartDate,
    startDate,
    endDate,
    setTempStartDate,
    applyDateFilter,
    pagesize,
    setPagesize,
    pageno,
    setPageno,
    selectedFaqId,
    list,
    setList,
  } = useFaqStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] =
    useState('');

  const { deleteFaq } = useAdminFaqMutation();

  const [tempPageSize, setTempPageSize] =
    useState(pagesize);

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = parseInt(e.target.value) || 10;
    setTempPageSize(newSize);
  };

  const handlePageSizeSubmit = () => {
    setPageno(1);
    setPagesize(tempPageSize);
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(e.target.value);
    setActiveSearchTerm(e.target.value);
  };

  const { data: faqData } = useAdminFaqQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    page_no: pageno,
    page_size: pagesize,
  });

  const totalPages = Math.ceil(
    (faqData?.total || 0) / pagesize,
  );
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  );

  const filteredFaqData = faqData?.list.filter((item) =>
    item.subject
      .toLowerCase()
      .includes(activeSearchTerm.toLowerCase()),
  );

  return (
    <div className={stylesA.container}>
      <AdminMenu />
      <section className={stylesA.section}>
        <div className={stylesB.sectionInner}>
          <div className={stylesB.sectionTop}>
            <div className={stylesB.menuWrap}>
              <button
                className={`${list === 'faq' ? stylesB.on : ''}`}
                onClick={() => setList('faq')}
              >
                FAQ List
              </button>
              <button
                className={`${list === 'new' ? stylesB.on : ''}`}
                onClick={() => setList('new')}
              >
                New FAQ
              </button>
            </div>
            {list === 'faq' ? (
              <div className={stylesB.dateWrap}>
                <div className={stylesB.calenderWrapper}>
                  <div className={stylesB.calenderWrap}>
                    <DatePicker
                      className={stylesB.datepickerInput}
                      selected={tempStartDate}
                      onChange={(date: Date) =>
                        setTempStartDate(date)
                      }
                      dateFormat='yyyy / MM / dd'
                    />
                  </div>
                  <span>~</span>
                  <div className={stylesB.calenderWrap}>
                    <DatePicker
                      className={stylesB.datepickerInput}
                      selected={endDate}
                      dateFormat='yyyy / MM / dd'
                    />
                  </div>
                </div>
                <button onClick={applyDateFilter}>
                  조회
                </button>
              </div>
            ) : null}
          </div>
          <div className={stylesB.sectionBottom}>
            {list === 'faq' ? (
              <>
                <div className={stylesB.bottomTop}>
                  <div className={stylesB.searchZone}>
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
                  <div className={stylesB.pageZone}>
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
                <FaqTable data={filteredFaqData} />
                <div className={stylesB.pagination}>
                  <button
                    className={stylesB.pagePrev}
                    onClick={() =>
                      setPageno(Math.max(1, pageno - 1))
                    }
                    disabled={pageno === 1}
                  />
                  <div className={stylesB.pageNumWrap}>
                    {pageNumbers.map((num) => (
                      <a
                        key={num}
                        href=''
                        className={
                          num === pageno ? stylesB.on : ''
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setPageno(num);
                        }}
                      >
                        {num}
                      </a>
                    ))}
                  </div>
                  <button
                    className={stylesB.pageNext}
                    onClick={() =>
                      setPageno(
                        Math.min(totalPages, pageno + 1),
                      )
                    }
                    disabled={pageno === totalPages}
                  />
                  <p>
                    Showing{' '}
                    <span className={stylesB.currentNum}>
                      {pageno}
                    </span>{' '}
                    Of{' '}
                    <span className={stylesB.totalNum}>
                      {totalPages}
                    </span>{' '}
                    Pages
                  </p>
                </div>
              </>
            ) : list === 'new' ? (
              <NewFaq />
            ) : null}
          </div>
        </div>
      </section>
      {ModalStates.FAQ.delete && (
        <AlertModal
          isOpen={ModalStates.FAQ.delete}
          onClose={() => toggleState('FAQ.delete')}
          title='삭제 하시겠습니까?'
          buttons={[
            {
              label: '취소',
              onClick: () => {
                toggleState('FAQ.delete');
              },
              variant: 'secondary',
            },
            {
              label: '확인',
              onClick: () => {
                deleteFaq.mutate(selectedFaqId);
                toggleState('FAQ.delete');
              },
              variant: 'primary',
            },
          ]}
        />
      )}
    </div>
  );
};

export default FaqPage;
