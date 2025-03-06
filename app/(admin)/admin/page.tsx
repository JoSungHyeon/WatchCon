'use client';

import { useAuthMutation } from '@/app/hooks/mutations/auth/useAuthMutation';
import { useAuthStore } from '@/app/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../components/admin/style/Login.module.css';

export default function AdminPage() {
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { ADMIN } = useAuthStore();
  const { adminLogin, adminLoginError } = useAuthMutation();

  const router = useRouter();

  useEffect(() => {
    if (ADMIN.isAdminLoggedIn) {
      router.push('/admin/ecommerce');
    }
  }, [ADMIN.isAdminLoggedIn, router]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    adminLogin({
      username: adminId,
      password: adminPassword,
    });
  };

  return (
    <div id={styles.login}>
      <div className={styles.loginInner}>
        <h1>
          <a href='/'>
            <img src='/img/admin/logo.png' alt='logo' />
          </a>
        </h1>
        <form action='' onSubmit={handleAdminLogin}>
          <div className={styles.inputWrap}>
            <input
              type='text'
              name='id'
              placeholder='아이디'
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
            <input
              type='password'
              name='password'
              placeholder='비밀번호'
              value={adminPassword}
              onChange={(e) =>
                setAdminPassword(e.target.value)
              }
            />
          </div>
          {adminLoginError && (
            <span
              style={{
                color: 'red',
                position: 'absolute',
                top: '280px',
              }}
            >
              아이디, 비밀번호를 확인해주세요.
            </span>
          )}
          <button type='submit'>로그인</button>
        </form>
      </div>
    </div>
  );
}
