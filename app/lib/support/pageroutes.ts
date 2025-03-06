import { Documents_en } from '@/app/(user)/support/settings/documents_en';
import { Documents_ko } from '@/app/(user)/support/settings/documents_ko';

export type Paths =
  | {
      title: string;
      href: string;
      noLink?: true;
      heading?: string;
      items?: Paths[];
    }
  | {
      spacer: true;
    };

export const getRoutes = (locale: 'ko' | 'en'): Paths[] => {
  switch (locale) {
    case 'ko':
      return [...Documents_ko];
    case 'en':
      return [...Documents_en];
    default:
      return [...Documents_ko];
  }
};

export const getPageRoutes = (locale: 'ko' | 'en') => {
  return getRoutes(locale)
    .map((it) => getAllLinks(it))
    .flat();
};

type Page = { title: string; href: string };

function isRoute(
  node: Paths,
): node is Extract<Paths, { title: string; href: string }> {
  return 'title' in node && 'href' in node;
}

function getAllLinks(node: Paths): Page[] {
  const pages: Page[] = [];

  if (isRoute(node) && !node.noLink) {
    const href = node.href;
    const finalHref = `/${getActiveLang()}${href.startsWith('/') ? href : `/${href}`}`;
    pages.push({ title: node.title, href: finalHref });
  }

  if (isRoute(node) && node.items) {
    const parentHref = node.href;
    for (const subNode of node.items) {
      if (isRoute(subNode)) {
        const href = subNode.href;
        const combinedHref = `${parentHref}${href.startsWith('/') ? href : `/${href}`}`;
        const finalHref = `/${getActiveLang()}${combinedHref.startsWith('/') ? combinedHref : `/${combinedHref}`}`;
        pages.push({
          title: subNode.title,
          href: finalHref,
        });
      }
    }
  }

  return pages;
}

const getActiveLang = (): 'ko' | 'en' => {
  try {
    if (typeof window === 'undefined') {
      return 'ko';
    }

    const pathname = window.location.pathname;
    const langMatch = pathname.match(/\/(ko|en)(\/|$)/);
    if (langMatch) {
      return langMatch[1] as 'ko' | 'en';
    }

    const savedLanguage =
      window.localStorage.getItem('i18nextLng');
    if (savedLanguage === 'en' || savedLanguage === 'ko') {
      return savedLanguage;
    }

    const browserLang = navigator.language
      .toLowerCase()
      .split('-')[0];
    if (browserLang === 'ko' || browserLang === 'en') {
      return browserLang as 'ko' | 'en';
    }

    return 'ko';
  } catch (error) {
    return 'ko';
  }
};

export const getActiveRoutes = () =>
  getRoutes(getActiveLang());

export const getActivePageRoutes = () =>
  getPageRoutes(getActiveLang());
