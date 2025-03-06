import { notFound } from 'next/navigation';

import { getDocument } from '@/app/lib/support/markdown';
import { Settings } from '@/app/lib/support/meta';
import { getActivePageRoutes } from '@/app/lib/support/pageroutes';
import { BackToTop } from '../navigation/backtotop';
import Feedback from '../navigation/feedback';
import PageBreadcrumb from '../navigation/pagebreadcrumb';
import Pagination from '../navigation/pagination';
import Toc from '../navigation/toc';
import { Typography } from '../ui/typography';
import './layout.css';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Pages({ params }: PageProps) {
  const { slug = [] } = await params;
  const pathName = slug.join('/');
  const res = await getDocument(pathName);

  if (!res) notFound();

  const { frontmatter, content, tocs } = res;

  return (
    <div className='flex items-start gap-14'>
      <div className='flex-[3] pt-10'>
        <PageBreadcrumb paths={slug} />
        <Typography>
          <h1
            className='text-3xl -mt-2'
            suppressHydrationWarning
          >
            {frontmatter.title}
          </h1>
          <p
            className='text-base text-muted-foreground text-[16.5px]'
            suppressHydrationWarning
          >
            {frontmatter.description}
          </p>
          <div suppressHydrationWarning>{content}</div>
          <Pagination pathname={pathName} />
        </Typography>
      </div>
      {Settings.rightbar && (
        <div className='hidden xl:flex xl:flex-col sticky top-16 gap-3 py-8 min-w-[230px] h-[94.5vh] toc'>
          {Settings.toc && <Toc tocs={tocs} />}
          {Settings.feedback && (
            <Feedback
              slug={pathName}
              title={frontmatter.title}
            />
          )}
          {Settings.totop && (
            <BackToTop className='mt-6 self-start text-sm text-neutral-800 dark:text-neutral-300/85' />
          )}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { slug = [] } = await params;
  const pathName = slug.join('/');
  const res = await getDocument(pathName);

  if (!res) return null;

  const { frontmatter, lastUpdated } = res;

  return {
    title: `${frontmatter.title} - ${Settings.title}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    ...(lastUpdated && {
      lastModified: new Date(lastUpdated).toISOString(),
    }),
  };
}

export function generateStaticParams() {
  return getActivePageRoutes()
    .filter((item) => item.href)
    .map((item) => ({
      slug: item.href.split('/').slice(1),
    }));
}
