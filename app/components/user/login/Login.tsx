'use client';

import styles from '@/app/components/user/login/style/Login.module.css';
import { useAuthStore } from '@/app/store/auth.store';
import { usePasswordStore } from '@/app/store/password.store';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthMutation } from '../../../hooks/mutations/auth/useAuthMutation';
interface LoginErrorResponse {
  status_code: number;
  message: string;
}

const Login = () => {
  const { t } = useTranslation('common');
  const [lostMode, setLostMode] = useState('id');
  const [activeBtn, setActiveBtn] = useState('id');
  const [findPwEmail, setFindPwEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');

  const {
    isIdFound,
    setIsIdFound,
    foundId,
    loginTab,
    setLoginTab,
    setOtpTab,
  } = useAuthStore();

  const { setEmailForPassword } = usePasswordStore();

  const {
    login,
    loginError,
    findId,
    findIdError,
    findPassword,
    findPasswordError,
    resetFindPasswordError,
  } = useAuthMutation();

  const typedLoginError =
    loginError as AxiosError<LoginErrorResponse>;

  useEffect(() => {
    const savedID = localStorage.getItem('watchconID');
    const isCheckedStorage =
      localStorage.getItem('watchconChecked') === 'true';
    if (savedID && isCheckedStorage) {
      setUsername(savedID);
      setIsChecked(true);
    } else {
      setIsChecked(false);
      setUsername('');
    }
  }, []);

  useEffect(() => {
    return () => {
      setIsIdFound(false);
    };
  }, [setIsIdFound]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (!checked) {
      localStorage.removeItem('watchconID');
      localStorage.removeItem('watchconChecked');
      setUsername('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isChecked) {
      localStorage.setItem('watchconID', username);
      localStorage.setItem('watchconChecked', 'true');
    }
    login({ username, password });
  };

  const chgMode = (e) => {
    e.preventDefault();
    let value = e.currentTarget.getAttribute('data-value');
    setLoginTab(value);
  };

  const chgLostMode = (e) => {
    e.preventDefault();
    let value = e.currentTarget.getAttribute('data-value');
    setLostMode(value);
    setActiveBtn(value);
    setEmail('');
    setIsIdFound(false);
    setFindPwEmail('');
    resetFindPasswordError();
  };

  const handleFindId = async (e) => {
    e.preventDefault();
    findId({ email });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <section id={styles.login}>
      <div className={styles.loginInner}>
        <div className={styles.loginLeft}>
          <h1>
            {isIdFound ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {findIdError ? (
                  <span className={styles.textInfo}>
                    {t('login.not_found')}
                  </span>
                ) : (
                  <span className={styles.textInfo}>
                    {t('login.your_email')}
                    <p>{foundId}</p>
                    {t('login.email_send_end')}
                  </span>
                )}
                <button
                  className={styles.confirmBtn}
                  onClick={() => setIsIdFound(false)}
                >
                  {t('login.continue')}
                </button>
              </div>
            ) : (
              <a href='/'>
                <img
                  src='/img/loginpage/logo.svg'
                  alt='logo'
                />
              </a>
            )}
          </h1>
        </div>
        {loginTab === 'login' ? (
          <form
            className={styles.loginForm}
            onSubmit={handleSubmit}
          >
            <strong>{t('login.login')}</strong>
            <div className={styles.inputWrap}>
              <input
                type='text'
                placeholder={t('login.id')}
                name='user'
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
              <input
                type='password'
                placeholder={t('login.password')}
                name='password'
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
              <div className={styles.saveWrap}>
                <input type='hidden' value='' />
                <span style={{ color: 'red' }}>
                  {typedLoginError?.response?.data
                    ?.status_code === 401
                    ? t('login.wrong_id_or_password')
                    : typedLoginError?.response?.data
                          ?.status_code === 404
                      ? t('login.wrong_id_or_password')
                      : ''}
                </span>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type='checkbox'
                      id='saveId'
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={{
                        width: '15px',
                        height: '15px',
                      }}
                    />
                    <label htmlFor='saveId'>
                      {t('login.save')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button
              type='submit'
              disabled={!username || !password}
            >
              {t('login.login')}
            </button>
            <a onClick={chgMode} data-value='lost'>
              {t('login.forgot')}
            </a>
          </form>
        ) : loginTab === 'lost' ? (
          <div className={styles.lostWrap}>
            <div className={styles.btnWrap}>
              <button
                onClick={chgLostMode}
                data-value='id'
                className={
                  activeBtn === 'id' ? styles.on : ''
                }
              >
                {t('login.lost_id')}
              </button>
              <button
                onClick={chgLostMode}
                data-value='pw'
                className={
                  activeBtn === 'pw' ? styles.on : ''
                }
              >
                {t('login.lost_password')}
              </button>
            </div>
            {lostMode === 'id' ? (
              <form onSubmit={handleFindId} noValidate>
                <div className={styles.inputWrap}>
                  <strong>{t('login.lost_id')}</strong>
                  <input
                    type='email'
                    placeholder={t(
                      'login.email_placeholder',
                    )}
                    name='email'
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>
                <button type='submit' disabled={!email}>
                  {t('login.lost_id')}
                </button>
              </form>
            ) : (
              <form action='' method=''>
                <div className={styles.inputWrap}>
                  <strong>
                    {t('login.lost_password')}
                  </strong>
                  <div className={styles.inputItem}>
                    <input
                      type='text'
                      placeholder={t(
                        'login.email_placeholder',
                      )}
                      value={findPwEmail}
                      name='lostemail'
                      onChange={(e) =>
                        setFindPwEmail(e.target.value)
                      }
                    />
                    {findPasswordError && (
                      <span className={styles.errorMessage}>
                        {t('login.error_email')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOtpTab('otp');
                    setEmailForPassword(findPwEmail);
                    findPassword(findPwEmail);
                  }}
                  disabled={
                    !findPwEmail ||
                    !isValidEmail(findPwEmail)
                  }
                  style={{
                    cursor:
                      !findPwEmail ||
                      !isValidEmail(findPwEmail)
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      !findPwEmail ||
                      !isValidEmail(findPwEmail)
                        ? '0.7'
                        : '1',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {t('login.continue')}
                </button>
              </form>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Login;
