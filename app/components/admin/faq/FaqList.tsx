import { FC } from 'react';

import stylesB from '../faq/style/Faq.module.css';
import FaqTable from './FaqTable';

const FaqList: FC = () => {
  return (
    <>
      <div className={stylesB.bottomTop}>
        <div className={stylesB.searchZone}>
          <input type='text' name='search' />
          <button>
            <img
              src='/img/admin/watchcon/search.svg'
              alt='search'
            />
          </button>
        </div>
        <div className={stylesB.pageZone}>
          <p>Entries Per Page</p>
          <div>
            <input type='number' />
          </div>
          {/* <button>조회</button> */}
        </div>
      </div>
      <FaqTable />
      <div className={stylesB.pagination}>
        <button className={stylesB.pagePrev}></button>
        <div className={stylesB.pageNumWrap}>
          <a href='' className={stylesB.on}>
            1
          </a>
          <a href=''>2</a>
        </div>
        <button className={stylesB.pageNext}></button>
        <p>
          Showing{' '}
          <span className={stylesB.currentNum}>1</span> Of{' '}
          <span className={stylesB.totalNum}>3</span> Pages
        </p>
      </div>
    </>
  );
};

export default FaqList;
