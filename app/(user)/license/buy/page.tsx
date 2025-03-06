'use client';
//ts-nocheck

import { AlertModal } from '@/app/components/common/modals/AlertModal';
import Header from '@/app/components/layout/Header';
import NicepayForm from '@/app/components/layout/NicepayForm';
import styles from '@/app/components/user/license/buy/style/Buy.module.css';
import { usePurchaseMutation } from '@/app/hooks/mutations/purchase/usePurchaseMutation';
import { useMainStore } from '@/app/store/main.store';
import { useModalStore } from '@/app/store/modal.store';
import { PurchaseRequestDto } from '@/app/types/dto/purchase/request.dto';
import crypto from 'crypto';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const BuyPage: React.FC = () => {
  const { t } = useTranslation();
  const { licenseType, price, featureId } = useMainStore();
  const { purchase, purchaseError, isError } =
    usePurchaseMutation();

  const merchantKey = 'b+zhZ4yOZ7FsH8pm5';
  const { ModalStates, toggleState } = useModalStore();
  const router = useRouter();

  const getLicenseTypeText = (type: number) => {
    switch (type) {
      case 2:
        return 'Lite';
      case 3:
        return 'Premium';
      case 4:
        return 'Business';
      default:
        return '';
    }
  };

  const [payUnit, setPayUnit] = useState('KW');
  const [subscribeDuration, setSubscribeDuration] =
    useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerTel: '',
    encMode: '',
    encData: '',
    license_type: licenseType - 1,
    purchase_type: '',
    purchase_mode: '0',
    price_features_list_id: '',
    cardNumber: '',
    cardExpirationYear: '',
    cardExpirationMonth: '',
    birth: '',
    cardPassword: '',
  });

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const encryptCardData = async (
    cardData: string,
    key: string,
  ) => {
    const encKey = key.substr(0, 16);
    const cipher = crypto.createCipheriv(
      'aes-128-ecb',
      encKey,
      Buffer.alloc(0),
    );
    const ciphertext = Buffer.concat([
      cipher.update(cardData, 'utf8'),
      cipher.final(),
    ]).toString('hex');

    return ciphertext;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === 'buyerName') {
      // 영문과 숫자만 허용 (대소문자, 숫자, 공백)
      const alphanumericOnly = value.replace(
        /[^a-zA-Z0-9\s]/g,
        '',
      );
      setFormData((prev) => ({
        ...prev,
        [name]: alphanumericOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [message, setMessage] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [moid, setMoid] = useState(''); // State for MOID

  const handleCheckAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사 추가
    const newErrors: Record<string, string> = {};

    if (!formData.buyerName.trim()) {
      newErrors.buyerName = t('buyPage.error_name');
    }

    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail = t('buyPage.error_email');
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.buyerEmail.trim(),
      )
    ) {
      newErrors.buyerEmail = t(
        'buyPage.error_email_format',
      );
    }

    // 에러가 있으면 여기서 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/user/check-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.buyerName,
            email: formData.buyerEmail,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        if (data.status_code === 200) {
          setMoid(data.moid);
          setMessage('User can be used for payment.');
          setShowPayment(true);
        } else {
          setErrors({
            buyerEmail: t('buyPage.error_duplicate'),
            buyerName: t('buyPage.error_duplicate'),
          });
          setMessage(t('buyPage.error_duplicate'));
        }
      } else {
        setErrors({
          buyerEmail:
            data.error || '서버 연결 오류가 발생했습니다.',
          buyerName:
            data.error || '서버 연결 오류가 발생했습니다.',
        });
        setMessage(
          data.error || 'Error connecting to server.',
        );
      }
    } catch (error) {
      setErrors({
        buyerEmail: '서버 연결 오류가 발생했습니다.',
        buyerName: '서버 연결 오류가 발생했습니다.',
      });
      setMessage('Error connecting to server.');
    }
  };

  useEffect(() => {
    console.log('Current States:', {
      isLoading,
      modalStates: ModalStates.MAIN,
    });
  }, [isLoading, ModalStates.MAIN]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({}); // 새로운 검증을 시작하기 전에 이전 에러들을 초기화

    // Validate all fields
    const newErrors: Record<string, string> = {};

    // 각 필드별로 값이 있는지 확인하고, 값이 있다면 에러 메시지를 추가하지 않음
    if (!formData.buyerName.trim()) {
      newErrors.buyerName = '정확한 이름을 입력해주세요';
    }

    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail =
        '정확한 메일 주소를 입력해주세요';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.buyerEmail.trim(),
      )
    ) {
      newErrors.buyerEmail =
        '올바른 이메일 형식이 아닙니다';
    }

    // if (!formData.buyerTel.trim()) {
    //   newErrors.buyerTel = '휴대폰 번호를 입력해주세요';
    // } else if (
    //   !/^[0-9]{10,11}$/.test(formData.buyerTel.trim())
    // ) {
    //   newErrors.buyerTel =
    //     '올바른 휴대폰 번호 형식이 아닙니다';
    // }

    // if (!formData.birth.trim()) {
    //   newErrors.birth =
    //     '생년월일 혹은 법인번호를 입력해주세요';
    // }

    // if (!formData.cardNumber.trim()) {
    //   newErrors.cardNumber = '카드번호를 입력해주세요';
    // }

    // if (!formData.cardExpirationMonth.trim()) {
    //   newErrors.cardExpirationMonth =
    //     '카드 유효날짜를 입력해주세요';
    // } else if (
    //   parseInt(formData.cardExpirationMonth) < 1 ||
    //   parseInt(formData.cardExpirationMonth) > 12
    // ) {
    //   newErrors.cardExpirationMonth =
    //     '올바른 월을 입력해주세요 (1-12)';
    // }

    // if (!formData.cardExpirationYear.trim()) {
    //   newErrors.cardExpirationYear =
    //     '카드 유효날짜를 입력해주세요';
    // }

    // if (!formData.cardPassword.trim()) {
    //   newErrors.cardPassword =
    //     '카드 비밀번호를 입력해주세요';
    // } else if (formData.cardPassword.length !== 2) {
    //   newErrors.cardPassword =
    //     '카드 비밀번호 앞 2자리를 입력해주세요';
    // }

    // 에러가 있는 경우에만 에러 상태를 업데이트하고 함수를 종료
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      // 카드 데이터 문자열 생성
      const cardDataString = `CardNo=${formData.cardNumber}&ExpYear=${formData.cardExpirationYear}&ExpMonth=${formData.cardExpirationMonth}&IDNo=${formData.birth}&CardPw=${formData.cardPassword}`;

      // 카드 데이터 암호화
      const encryptedData = await encryptCardData(
        cardDataString,
        merchantKey,
      );

      const purchaseData = {
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerTel: formData.buyerTel,
        encMode: null,
        encData: encryptedData,
        license_type: Number(formData.license_type),
        purchase_type: Number(formData.purchase_type),
        purchase_mode: Number(formData.purchase_mode),
        price_features_list_id: Number(featureId),
      } as unknown as PurchaseRequestDto;

      await purchase(purchaseData);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article>
      <Header />
      <div className={styles.container}>
        {!showPayment ? (
          <form
            className={styles.contentWrap}
            onSubmit={handleCheckAccount}
          >
            <header className='flex flex-row gap-4'>
              {/* <select
                name='payUnit'
                value={payUnit}
                onChange={(e) => {
                  setPayUnit(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    purchase_type:
                      e.target.value === 'KW' ? '0' : '1',
                  }));
                }}
              >
                <option value='KW'>KW</option>
                <option value='USD'>USD</option>
              </select> */}

              <select
                name='subscribe-duration'
                value={subscribeDuration}
                onChange={(e) => {
                  setSubscribeDuration(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    purchase_mode:
                      e.target.value === 'monthly'
                        ? '0'
                        : '1',
                  }));
                }}
              >
                <option value='monthly'>Monthly</option>
                <option value='yearly'>Yearly</option>
              </select>
            </header>
            <div className={styles.contentLeft}>
              <div className={styles.name}>
                <p>{t('buyPage.name')}</p>
                <input
                  type='text'
                  name='buyerName'
                  value={formData.buyerName}
                  onChange={handleInputChange}
                />
                {errors.buyerName && (
                  <p
                    className={`text-red-500 ${styles.errorText}`}
                  >
                    {errors.buyerName}
                  </p>
                )}
              </div>
              <div className={styles.email}>
                <p>{t('buyPage.email')}</p>
                <input
                  type='text'
                  name='buyerEmail'
                  value={formData.buyerEmail}
                  onChange={handleInputChange}
                />
                {errors.buyerEmail && (
                  <p
                    className={`text-red-500 ${styles.errorText}`}
                  >
                    {errors.buyerEmail}
                  </p>
                )}
              </div>
              {/* <div className={styles.tel}>
              <p>휴대폰 번호</p>
              <input
                type='tel'
                name='buyerTel'
                value={formData.buyerTel}
                onChange={handleInputChange}
                maxLength={11}
              />
              {errors.buyerTel && (
                <p
                  className={`text-red-500 ${styles.errorText}`}
                >
                  {errors.buyerTel}
                </p>
              )}
            </div>
            <div className={styles.birth}>
              <p>생년월일 (법인카드 : 법인번호)</p>
              <input
                type='number'
                placeholder='YYMMDD'
                name='birth'
                value={formData.birth}
                onChange={handleInputChange}
              />
              {errors.birth && (
                <p
                  className={`text-red-500 ${styles.errorText}`}
                >
                  {errors.birth}
                </p>
              )}
            </div>
            <div className={styles.cardNum}>
              <p>카드번호</p>
              <input
                type='number'
                name='cardNumber'
                value={formData.cardNumber}
                onChange={handleInputChange}
              />
              {errors.cardNumber && (
                <p
                  className={`text-red-500 ${styles.errorText}`}
                >
                  {errors.cardNumber}
                </p>
              )}
            </div>
            <div className={styles.cardExpiration}>
              <p>카드유효기한</p>
              <div className={styles.inputWrap}>
                <input
                  type='number'
                  placeholder='MM'
                  name='cardExpirationMonth'
                  value={formData.cardExpirationMonth}
                  onChange={handleInputChange}
                />
                <input
                  type='number'
                  placeholder='YY'
                  name='cardExpirationYear'
                  value={formData.cardExpirationYear}
                  onChange={handleInputChange}
                />
              </div>
              {(errors.cardExpirationMonth ||
                errors.cardExpirationYear) && (
                <p
                  className={`text-red-500 ${styles.errorText}`}
                >
                  {errors.cardExpirationMonth ||
                    errors.cardExpirationYear}
                </p>
              )}
            </div>
            <div className={styles.cardPassword}>
              <p>카드비밀번호 앞두자리</p>
              <input
                type='password'
                name='cardPassword'
                value={formData.cardPassword}
                onChange={handleInputChange}
              />
              {errors.cardPassword && (
                <p
                  className={`text-red-500 ${styles.errorText}`}
                >
                  {errors.cardPassword}
                </p>
              )}
            </div> */}
            </div>
            <div className={styles.contentRight}>
              <div className={styles.rightTop}>
                <div className={styles.type}>
                  <p>{t('buyPage.licenseType')}</p>
                  <input
                    type='text'
                    name='licenseType'
                    value={getLicenseTypeText(licenseType)}
                    readOnly
                  />
                </div>
              </div>
              <div className={styles.rightBottom}>
                <div className={styles.totalWrap}>
                  <div className={styles.totalPrice}>
                    <p>총계</p>
                    <strong>
                      {payUnit === 'KW'
                        ? `₩${subscribeDuration === 'yearly' ? price.kw * 12 : price.kw}`
                        : `$${subscribeDuration === 'yearly' ? price.usd * 12 : price.usd}`}
                    </strong>
                  </div>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`${styles.submitButton} ${isLoading ? styles.disabled : ''}`}
                  >
                    {isLoading ? '처리중...' : '확인'}
                  </button>
                  {isLoading && (
                    <div className={styles.loadingText}>
                      결제가 진행중입니다...
                    </div>
                  )}
                  {isLoading && (
                    <AlertModal
                      isOpen={true}
                      onClose={() => {}}
                      title='결제중...'
                      buttons={[]}
                    />
                  )}
                  {isError &&
                    purchaseError instanceof Error && (
                      <p className='text-red-500 mt-2 text-sm font-bold'>
                        {purchaseError.message.includes(
                          'User',
                        )
                          ? '이미 등록된 사용자가 있습니다. 이름, 이메일을 새로 입력해주세요.'
                          : '카드 정보에 오류가 있습니다. 재확인해주세요.'}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <NicepayForm
            amount={price.kw.toString()}
            goodsName={getLicenseTypeText(licenseType)}
            buyerName={formData.buyerName}
            buyerEmail={formData.buyerEmail}
            buyerTel='00000000000'
            moid={moid}
            username={formData.buyerName}
          />
        )}
      </div>

      {ModalStates.MAIN.purchase_success && (
        <AlertModal
          isOpen={true}
          onClose={() =>
            toggleState('MAIN.purchase_success')
          }
          title='결제가 완료되었습니다.'
          buttons={[
            {
              label: '확인',
              onClick: () => router.push('/'),
            },
          ]}
        />
      )}
    </article>
  );
};

export default BuyPage;
