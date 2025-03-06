import { useModalStore } from '@/app/store/modal.store';
import Link from 'next/link';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyModal } from '../common/modals/companyModal';
import { MailModal } from '../common/modals/MailModal';
import { PolicyModal } from '../common/modals/PolicyModal';
import styles from './style/Footer.module.css';

const Footer: FC = () => {
  const { t } = useTranslation('common');
  const modalStore = useModalStore();

  const handleClick = (path: string, type: string) => {
    if (type === 'section') {
      handleScroll(path);
    } else if (path === 'mailModal' && type === 'modal') {
      modalStore.toggleState('WATCHCON.mail'); // 메일 모달 토글
    } else if (
      path === 'companyModal' &&
      type === 'modal'
    ) {
      modalStore.toggleState('WATCHCON.company'); // 회사 모달 토글
    } else {
      window.location.href = path;
    }
  };

  const handleScroll = (section: string) => {
    const element = document.querySelector(
      `[data-section="${section}"]`,
    );
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const footerData = [
    {
      title: t('footer.data.data1.title'),
      list: [
        t('footer.data.data1.list.list1'),
        t('footer.data.data1.list.list2'),
        t('footer.data.data1.list.list3'),
        t('footer.data.data1.list.list4'),
        t('footer.data.data1.list.list5'),
      ],
      links: [
        { path: 'intro', type: 'section' },
        { path: 'pricing', type: 'section' },
        { path: 'character', type: 'section' },
        { path: 'example', type: 'section' },
        { path: 'companyModal', type: 'modal' },
      ],
    },
    {
      title: t('footer.data.data2.title'),
      list: [
        t('footer.data.data2.list.list1'),
        t('footer.data.data2.list.list2'),
      ],
      links: [
        { path: '/', type: 'route' },
        { path: '/', type: 'route' },
      ],
    },
    {
      title: t('footer.data.data3.title'),
      list: [
        t('footer.data.data3.list.list1'),
        t('footer.data.data3.list.list2'),
        t('footer.data.data3.list.list3'),
      ],
      links: [
        { path: 'mailModal', type: 'modal' },
        {
          path: '/support/ko/quickly_start',
          type: 'route',
        },
        { path: 'faq', type: 'section' },
      ],
    },
  ];

  return (
    <>
      <footer id={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <div className={styles.logo}>
              <h1>
                <Link href='/'>
                  <img
                    src='/img/footer/footer_logo.svg'
                    alt='footer_logo'
                  />
                </Link>
              </h1>
            </div>
            <div className={styles.utils}>
              <ul>
                <li>
                  <Link href='/'>
                    <img
                      src='/img/footer/youtube.png'
                      alt='youtube'
                    />
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <img
                      src='/img/footer/facebook.png'
                      alt='facebook'
                    />
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <img
                      src='/img/footer/insta.png'
                      alt='insta'
                    />
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <img
                      src='/img/footer/twitter.png'
                      alt='twitter'
                    />
                  </Link>
                </li>
              </ul>
              <div className={styles.addressWrapper}>
                <div className={styles.nameWrap}>
                  <strong>{t('footer.name')}</strong>
                  <p>{t('footer.name_p')}</p>
                </div>
                <div className={styles.mailWrap}>
                  <strong>{t('footer.mail')}</strong>
                  <p>{t('footer.mail_p')}</p>
                </div>
                <div className={styles.businessWrap}>
                  <strong>{t('footer.business')}</strong>
                  <p>{t('footer.business_p')}</p>
                </div>
                <div className={styles.addressWrap}>
                  <strong>{t('footer.address')}</strong>
                  <p>{t('footer.address_p')}</p>
                  <span>{t('footer.address_span')}</span>
                </div>
                <div className={styles.numberWrap}>
                  <strong>{t('footer.number')}</strong>
                  <p>{t('footer.number_p')}</p>
                  <span>{t('footer.number_span')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerRight}>
            {footerData.map((item, i) => (
              <div className={styles.listWrap} key={i}>
                <p>{item.title}</p>
                <ul>
                  {item.list.map((list, j) => (
                    <li key={j}>
                      {item.links[j].type === 'section' ? (
                        <a
                          onClick={() =>
                            handleScroll(item.links[j].path)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {list}
                        </a>
                      ) : (
                        <a
                          onClick={() =>
                            handleClick(
                              item.links[j].path,
                              item.links[j].type,
                            )
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {list}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            {t('footer.company')}
          </div>
          <div className={styles.bottomRight}>
            <a
              onClick={(e) => {
                e.preventDefault();
                modalStore.toggleState('WATCHCON.privacy');
              }}
              style={{ cursor: 'pointer' }}
            >
              {t('footer.util_1')}
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                modalStore.toggleState('WATCHCON.legal');
              }}
              style={{ cursor: 'pointer' }}
            >
              {t('footer.util_2')}
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                modalStore.toggleState('WATCHCON.terms');
              }}
              style={{ cursor: 'pointer' }}
            >
              {t('footer.util_3')}
            </a>
          </div>
        </div>
      </footer>

      {modalStore.ModalStates.WATCHCON.mail && (
        <MailModal
          isOpen={modalStore.ModalStates.WATCHCON.mail}
          onClose={() =>
            modalStore.toggleState('WATCHCON.mail')
          }
          title='문의하기'
        />
      )}

      {modalStore.ModalStates.WATCHCON.privacy && (
        <PolicyModal
          isOpen={modalStore.ModalStates.WATCHCON.privacy}
          onClose={() =>
            modalStore.toggleState('WATCHCON.privacy')
          }
          title='개인정보 보호정책'
          content='내용'
          footer='하단내용'
        />
      )}

      {modalStore.ModalStates.WATCHCON.legal && (
        <PolicyModal
          isOpen={modalStore.ModalStates.WATCHCON.legal}
          onClose={() =>
            modalStore.toggleState('WATCHCON.legal')
          }
          title='법적고지'
          content='내용'
          footer='하단내용'
        />
      )}

      {modalStore.ModalStates.WATCHCON.terms && (
        <PolicyModal
          isOpen={modalStore.ModalStates.WATCHCON.terms}
          onClose={() =>
            modalStore.toggleState('WATCHCON.terms')
          }
          title='이용약관'
          content='내용'
          footer='하단내용'
        />
      )}

      {modalStore.ModalStates.WATCHCON.company && (
        <CompanyModal
          isOpen={modalStore.ModalStates.WATCHCON.company}
          onClose={() =>
            modalStore.toggleState('WATCHCON.company')
          }
          companyInfo={{
            name: '제이피플㈜',
            ceo: '이은석',
            services:
              '정보통신, 제조 / 소프트웨어 개발공급, 자동제어장치',
            address_main:
              '경기도 화성시 동탄대로 683 SH스퀘어2 4층 403호 (영천동, 에스에이치스퀘어투)',
            address_sub:
              '서울특별시 금천구 서부샛길 606 대성디폴리스 지식산업센터, A동 2907호(가산동, 대성디폴리스지식산업센터)',
            tel: '02-861-9248',
            fax: '02-861-9249',
          }}
          history={[
            {
              year: '2022',
              events: ['01. '],
            },
            {
              year: '2021',
              events: [
                '09. 무인항공기 자동 추적기 디자인 등록 (특허-30-1126472)',
                '07. 소프트웨어 품질인증 1등급 GS인증',
                '06. 벤처기업인증',
                '05. 중소기업 초기창업 패키지 지원기업 선정 (중소벤처기업부)',
                '03. 중소기업인증',
                '02. 기업 부설연구소 인증 ISO 9001 / 14001 인증',
              ],
            },
            {
              year: '2020',
              events: [
                '12. DRONE 추적장치 두산모빌리티 이노베이션 MOU 체결',
                '03. 제이피플㈜ 법인설립',
              ],
            },
          ]}
        />
      )}
    </>
  );
};

export default Footer;
