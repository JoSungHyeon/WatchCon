'use client';

import Graph from '../../../components/admin/ecommerce/Graph';
import Total from '../../../components/admin/ecommerce/Total';
import User from '../../../components/admin/ecommerce/User';
import stylesB from '../../../components/admin/ecommerce/style/page.module.css';
import stylesA from '../../../components/admin/style/common.module.css';
import AdminMenu from '../../../components/layout/AdminMenu';
const EcommercePage: React.FC = () => {
  return (
    <>
      <div className={stylesA.container}>
        <AdminMenu />
        <section className={stylesA.section}>
          <div className={stylesB.sectionInner}>
            <Total />
            <Graph />
            <User />
          </div>
        </section>
      </div>
    </>
  );
};

export default EcommercePage;
