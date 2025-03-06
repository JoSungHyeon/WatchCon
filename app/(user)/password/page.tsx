'use client';

import { useAuthMutation } from '@/app/hooks/mutations/auth/useAuthMutation';
import { useAuthStore } from '@/app/store/auth.store';
import { usePasswordStore } from '@/app/store/password.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../components/user/password/style/page.module.css';

export default function passWord() {
  const [otp, setOtp] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10분 = 600초
  const router = useRouter();

  const { otpTab, setOtpTab } = useAuthStore();
  const {
    verifyOtp,
    verifyOtpError,
    resetVerifyOtpError,
    changePassword,
    changePasswordError,
    resetChangePasswordError,
  } = useAuthMutation();

  const { emailForPassword } = usePasswordStore();

  useEffect(() => {
    if (otpTab === 'otp' && !timeExpired) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimeExpired(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpTab]);

  // 분과 초로 변환하는 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const confirm = () => {
    if (otpTab === 'otp') {
      verifyOtp({ otpCode: otp, email: emailForPassword });
      setOtp('');
    } else {
      if (newPassword !== confirmPassword) {
        setPasswordError(
          '입력하신 비밀번호가 일치하지 않습니다.',
        );
        return;
      }
      setPasswordError('');
      changePassword(
        { newPassword, email: emailForPassword },
        {
          onSuccess: () => {
            setNewPassword('');
            setConfirmPassword('');
            setSuccess(true);
          },
        },
      );
    }
  };

  return (
    <section id={styles.password}>
      <div className={styles.passwordInner}>
        {timeExpired ? (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ marginBottom: '15px' }}>
              OTP 인증 시간이 만료되었습니다.
            </span>
            <button
              onClick={() => router.push('/')}
              style={{
                cursor: 'pointer',
                backgroundColor: '#012840',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '1.25em',
                padding: '10px 20px',
                border: 'none',
              }}
            >
              확인
            </button>
          </div>
        ) : null}
        <div className={styles.innerLeft}>
          <h1>
            {verifyOtpError ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span>정확한 OTP 코드를 입력해주세요.</span>
                <button
                  onClick={() => resetVerifyOtpError()}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#012840',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '1.25em',
                    lineHeight: '45px',
                    width: '50%',
                    border: 'none',
                    margin: '10px auto',
                  }}
                >
                  확인
                </button>
              </div>
            ) : passwordError ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span>
                  입력하신 비밀번호가 일치하지 않습니다.
                </span>
                <button
                  onClick={() => setPasswordError('')}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#012840',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '1.25em',
                    lineHeight: '45px',
                    width: '50%',
                    border: 'none',
                    margin: '10px auto',
                  }}
                >
                  확인
                </button>
              </div>
            ) : changePasswordError?.includes('first') ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span>OTP 인증을 먼저 진행해주세요.</span>
                <button
                  onClick={() => {
                    resetChangePasswordError();
                    setOtpTab('otp');
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#012840',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '1.25em',
                    lineHeight: '45px',
                    width: '50%',
                    border: 'none',
                    margin: '10px auto',
                  }}
                >
                  확인
                </button>
              </div>
            ) : changePasswordError?.includes('expired') ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span>
                  만료된 OTP 코드입니다. 다시 시도해주세요.
                </span>
                <button
                  onClick={() => {
                    resetChangePasswordError();
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#012840',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '1.25em',
                    lineHeight: '45px',
                    width: '50%',
                    border: 'none',
                    margin: '10px auto',
                  }}
                >
                  확인
                </button>
              </div>
            ) : success ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span className='text-ml font-bold'>
                  성공적으로 비밀번호를 <br />
                  변경하였습니다.
                </span>
                <button
                  onClick={() => {
                    setSuccess(false);
                    router.push('/');
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#012840',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '1em',
                    lineHeight: '45px',
                    width: '70%',
                    height: '40px',
                    border: 'none',
                    margin: '10px auto',
                  }}
                >
                  확인
                </button>
              </div>
            ) : (
              <a href='/'>
                <img
                  src='/img/password/logo.png'
                  alt='logo'
                />
              </a>
            )}
          </h1>
        </div>
        <div className={styles.innerRight}>
          {otpTab === 'otp' ? (
            <div className={styles.rightTop}>
              <div className={styles.stepWrap}>
                <div className={styles.on}>OTP 인증</div>
                <div></div>
              </div>
              <div className={styles.inputWrap}>
                <p>메일로 받은 OTP코드를 입력하세요.</p>
                <p
                  style={{
                    color:
                      timeLeft < 60 ? '#ff0000' : '#012840',
                    fontSize: '0.9em',
                    marginTop: '5px',
                  }}
                >
                  남은 시간: {formatTime(timeLeft)}
                </p>
                <input
                  type='text'
                  name='code'
                  placeholder='OTP 코드를 입력하세요.'
                  value={otp || ''}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete='off'
                />
              </div>
            </div>
          ) : (
            <div className={styles.rightTop}>
              <div className={styles.stepWrap}>
                <div></div>
                <div className={styles.on}>
                  비밀번호 변경
                </div>
              </div>
              <div className={styles.inputWrap}>
                <p>변경할 비밀번호를 입력하세요.</p>
                <input
                  type='password'
                  name='new-password'
                  placeholder='새로운 비밀번호를 입력하세요.'
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                  }}
                  autoComplete='new-password'
                  data-form-type='other'
                />
                <input
                  type='password'
                  name='confirm-password'
                  placeholder='비밀번호 확인'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  autoComplete='new-password'
                  data-form-type='other'
                />
              </div>
            </div>
          )}
          <button
            disabled={
              otpTab === 'otp'
                ? !otp
                : !newPassword || !confirmPassword
            }
            onClick={confirm}
            style={{
              cursor:
                otpTab === 'otp'
                  ? !otp
                    ? 'not-allowed'
                    : 'pointer'
                  : !newPassword || !confirmPassword
                    ? 'not-allowed'
                    : 'pointer',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </section>
  );
}
