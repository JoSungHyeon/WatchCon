'use client';

import { useListUserQuery } from '@/app/hooks/queries/admin/ecommerce/useEcommerceQuery';
import { FC, useState } from 'react';
import styles from './style/User.module.css';

const User: FC = () => {
  const { data: listUser } = useListUserQuery();

  console.log(listUser?.data?.list1);
  const [mode, setMode] = useState(false);

  const userModeHandler = () => {
    setMode(!mode);
  };

  return (
    <div
      className={`${styles.userWrapper} ${mode ? styles.on : ''}`}
    >
      <div className={styles.tableWrapper}>
        <div className={styles.tableTop}>
          <button onClick={userModeHandler}>
            {mode ? (
              <img
                src='/img/admin/ecommerce/minus.svg'
                alt='more'
              />
            ) : (
              <img
                src='/img/admin/ecommerce/plus.svg'
                alt='more'
              />
            )}
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>WatchCon ID</th>
              <th>유료/무료</th>
              <th>누적접속수</th>
              <th>설치일자</th>
              <th>사용기간</th>
              <th>마지막 접속시간</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(listUser?.data?.list1) &&
              listUser?.data?.list1
                ?.sort(
                  (a, b) =>
                    b.max_connection_count -
                    a.max_connection_count,
                )
                ?.slice(0, mode ? undefined : 2)
                ?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.watchcon_id}</td>
                    <td>
                      {item.login_status > 0
                        ? '유료'
                        : '무료'}
                    </td>
                    <td>{item.max_connection_count}</td>
                    <td>
                      {
                        new Date(item.install_time)
                          .toISOString()
                          .split('T')[0]
                      }
                    </td>
                    <td>{item.using_day}</td>
                    <td>
                      {
                        new Date(item.Last_time)
                          .toISOString()
                          .split('T')[0]
                      }
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
