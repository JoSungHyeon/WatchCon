import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export default function PageBreadcrumb({
  paths,
}: {
  paths: string[];
}) {
  // support, kr, en을 제외한 경로만 필터링
  const filteredPaths = paths.filter(
    (path) => !['support', 'ko', 'en'].includes(path),
  );

  return (
    <div className='pb-5'>
      <Breadcrumb>
        <BreadcrumbList>
          {filteredPaths.map((path, index) => {
            const href = `/support/${filteredPaths.slice(0, index + 1).join('/')}`;

            return (
              <Fragment key={path}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index < filteredPaths.length - 1 ? (
                    <BreadcrumbLink
                      href={href}
                      className='a'
                    >
                      {toTitleCase(path)}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className='b'>
                      {toTitleCase(path)}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function toTitleCase(input: string): string {
  const words = input.split('-');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(' ');
}
