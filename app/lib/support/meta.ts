import {
  branding,
  feedbackedit,
  gtm,
  gtmconnected,
  loadfromgithub,
  rightsidebar,
  siteicon,
  sitename,
  tableofcontent,
  totopscroll,
  url,
  urlimage,
} from '@/app/(user)/support/settings/settings';

import {
  OpenGraph,
  TwitterCard,
} from '@/app/lib/support/metadata';

export const Company = {
  branding: branding,
};

export const Settings = {
  gtm: gtm,
  gtmconnected: gtmconnected,
  rightbar: rightsidebar,
  toc: tableofcontent,
  feedback: feedbackedit,
  totop: totopscroll,
  gitload: loadfromgithub,

  title: sitename,
  metadataBase: url,
  siteicon: siteicon,
  openGraph: {
    type: 'website',
    title: sitename,
    siteName: sitename,
    images: [
      {
        url: urlimage,
        width: 1200,
        height: 630,
      },
    ],
  } as OpenGraph,
  twitter: {
    card: 'summary_large_image',
    title: sitename,
    images: [
      {
        url: urlimage,
      },
    ],
  } as TwitterCard,
  canonical: url,
};
