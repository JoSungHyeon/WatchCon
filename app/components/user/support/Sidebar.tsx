'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Documents_ko } from '@/app/(user)/support/settings/documents_ko';
import styles from './style/Sidebar.module.css';
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type ExpandedState = {
  [key: string]: boolean;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpand = (href: string) => {
    setExpanded(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  const renderNavItems = (items: any[], level = 0) => {
    return items.map((item, index) => {
      if (item.spacer) {
        return <div key={`spacer-${index}`} className={styles.spacer} />;
      }

      const hasChildren = item.items && item.items.length > 0;
      const isExpanded = expanded[item.href];
      const isActive = pathname === `/support${item.href}`;

      return (
        <div key={item.href || index}>
          {item.heading && (
            <h3 className={styles.sectionTitle}>{item.heading}</h3>
          )}
          <div>
            <div
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${
                hasChildren ? styles.navItemWithChildren : ''
              }`}
              onClick={() => hasChildren && toggleExpand(item.href)}
              style={{ cursor: hasChildren ? 'pointer' : 'default' }}
            >
              <Link href={`/support${item.href}`}>
                <span className="flex items-center">
                  {item.title}
                  {hasChildren && (
                    <span className={styles.navItemExpand}>
                      {isExpanded ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </span>
              </Link>
            </div>
            {hasChildren && isExpanded && (
              <div className={styles.subNav}>
                {renderNavItems(item.items, level + 1)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>
          WatchCon Support
        </h2>
      </div>
      <nav className={styles.nav}>
        <div className={styles.navList}>
          {renderNavItems(Documents_ko)}
        </div>
      </nav>
    </div>
  );
}
