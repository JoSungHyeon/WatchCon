'use client';

import { useState } from 'react';
import { useMainQuery } from '../../hooks/queries/main/useMainQuery';
import Arrow from './Arrow';
import styles from './style/Faq.module.css';

const Faq = () => {
  const { data } = useMainQuery();
  const [openId, setOpenId] = useState(null);

  const toggleContent = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section data-section='faq' id={styles.faq}>
      <div className={styles.faqInner}>
        <h2>FAQ</h2>
        <div className={styles.list}>
          {data?.data.data.map((data) => (
            <div className={styles.listItem} key={data.id}>
              <a
                href=''
                onClick={(e) => {
                  e.preventDefault();
                  toggleContent(data.id);
                }}
              >
                <p>{data.subject}</p>
              </a>
              <span
                style={{
                  display:
                    openId === data.id ? 'block' : 'none',
                }}
              >
                {data.content}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Arrow direction='top' />
    </section>
  );
};

export default Faq;
