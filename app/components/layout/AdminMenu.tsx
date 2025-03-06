'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import styles from './style/AdminMenu.module.css';

const AdminMenu: FC = () => {
  const pathname = usePathname();

  return (
    <div id={styles.menu}>
      <h1>
        <Link href='/'>
          <img
            src='/img/admin/menu_logo.png'
            alt='menu logo'
          />
        </Link>
      </h1>
      <div className={styles.menuInner}>
        <div>
          <strong
            className={
              pathname === '/admin/ecommerce' ||
              pathname === '/admin/watchcon'
                ? styles.on
                : ''
            }
          >
            DashBoard
          </strong>
          <ul>
            <li>
              <Link
                href='/admin/ecommerce'
                className={
                  pathname === '/admin/ecommerce'
                    ? styles.on
                    : ''
                }
              >
                eCommerce
              </Link>
            </li>
            <li>
              <Link
                href='/admin/watchcon'
                className={
                  pathname === '/admin/watchcon'
                    ? styles.on
                    : ''
                }
              >
                WatchCon
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <strong
            className={
              pathname === '/admin/pricing' ||
              pathname === '/admin/faq' ||
              pathname === '/admin/users' ||
              pathname === '/admin/notice'
                ? styles.on
                : ''
            }
          >
            Settings
          </strong>
          <ul>
            <li>
              <Link
                href='/admin/pricing'
                className={
                  pathname === '/admin/pricing'
                    ? styles.on
                    : ''
                }
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href='/admin/faq'
                className={
                  pathname === '/admin/faq' ? styles.on : ''
                }
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href='/admin/users'
                className={
                  pathname === '/admin/users'
                    ? styles.on
                    : ''
                }
              >
                User
              </Link>
            </li>
            <li>
              <Link
                href='/admin/notice'
                className={
                  pathname === '/admin/notice'
                    ? styles.on
                    : ''
                }
              >
                Notice
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <strong
            className={
              pathname === '/admin/purchase' ||
              pathname === '/admin/tech' ||
              pathname === '/admin/sales'
                ? styles.on
                : ''
            }
          >
            Requests
          </strong>
          <ul>
            <li>
              <Link
                href='/admin/purchase'
                className={
                  pathname === '/admin/purchase'
                    ? styles.on
                    : ''
                }
              >
                Purchase
              </Link>
            </li>
            <li>
              <Link
                href='/admin/tech'
                className={
                  pathname.startsWith('/admin/tech')
                    ? styles.on
                    : ''
                }
              >
                Tech
              </Link>
            </li>
            <li>
              <Link
                href='/admin/sales'
                className={
                  pathname.startsWith('/admin/sales')
                    ? styles.on
                    : ''
                }
              >
                Sales
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
