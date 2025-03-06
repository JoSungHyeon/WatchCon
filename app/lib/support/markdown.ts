import { createReadStream, promises as fs } from 'fs';
import { Element, Text } from 'hast';
import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { components } from '@/app/lib/support/components';
import { Settings } from '@/app/lib/support/meta';
import { getActivePageRoutes } from '@/app/lib/support/pageroutes';

declare module 'hast' {
  interface Element {
    raw?: string;
  }
}

type BaseMdxFrontmatter = {
  title: string;
  description: string;
  keywords: string;
};

async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preCopy,
          rehypeCodeTitles,
          rehypeKatex,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postCopy,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

type SupportedLanguage = 'ko' | 'en';

const computeDocumentPath = (
  slug: string,
  lang: SupportedLanguage = 'ko',
) => {
  const langPath = lang === 'ko' ? '' : `/${lang}`;
  return Settings.gitload
    ? `/raw/main/app/(user)/support/docs${langPath}/${slug}/index.mdx`
    : path.join(
        process.cwd(),
        `/app/(user)/support/docs${langPath}/`,
        `${slug}/index.mdx`,
      );
};

const getDocumentPath = (() => {
  const cache = new Map<string, string>();
  return (slug: string, lang: SupportedLanguage = 'ko') => {
    const key = `${lang}:${slug}`;
    if (!cache.has(key)) {
      cache.set(key, computeDocumentPath(slug, lang));
    }
    return cache.get(key)!;
  };
})();

export async function getDocument(
  slug: string,
  lang: SupportedLanguage = 'ko',
) {
  try {
    const contentPath = getDocumentPath(slug, lang);
    let rawMdx = '';
    let lastUpdated: string | null = null;

    try {
      if (Settings.gitload) {
        const response = await fetch(contentPath);
        if (!response.ok) {
          if (lang !== 'ko') {
            return null;
          }
          throw new Error(
            `Failed to fetch content from GitHub: ${response.statusText}`,
          );
        }
        rawMdx = await response.text();
        lastUpdated =
          response.headers.get('Last-Modified') ?? null;
      } else {
        rawMdx = await fs.readFile(contentPath, 'utf-8');
        const stats = await fs.stat(contentPath);
        lastUpdated = stats.mtime.toISOString();
      }

      const parsedMdx =
        await parseMdx<BaseMdxFrontmatter>(rawMdx);
      const tocs = await getTable(slug, lang);

      return {
        frontmatter: parsedMdx.frontmatter,
        content: parsedMdx.content,
        tocs,
        lastUpdated,
        lang,
      };
    } catch (error) {
      if (lang !== 'ko') {
        return null;
      }
      throw error;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

const headingsRegex = /^(#{2,4})\s(.+)$/gm;

export async function getTable(
  slug: string,
  lang: SupportedLanguage = 'ko',
): Promise<
  Array<{
    level: number;
    text: string;
    href: string;
  }>
> {
  const extractedHeadings: Array<{
    level: number;
    text: string;
    href: string;
  }> = [];
  let rawMdx = '';

  if (Settings.gitload) {
    const contentPath = getDocumentPath(slug, lang);
    try {
      const response = await fetch(contentPath);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch content from GitHub: ${response.statusText}`,
        );
      }
      rawMdx = await response.text();
    } catch (error) {
      if (lang !== 'ko') {
        return getTable(slug, 'ko');
      }
      console.error(
        'Error fetching content from GitHub:',
        error,
      );
      return [];
    }
  } else {
    const contentPath = getDocumentPath(slug, lang);
    try {
      const stream = createReadStream(contentPath, {
        encoding: 'utf-8',
      });
      for await (const chunk of stream) {
        rawMdx += chunk;
      }
    } catch (error) {
      if (lang !== 'ko') {
        return getTable(slug, 'ko');
      }
      console.error('Error reading local file:', error);
      return [];
    }
  }

  let match;
  while ((match = headingsRegex.exec(rawMdx)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    extractedHeadings.push({
      level: level,
      text: text,
      href: `#${innerslug(text)}`,
    });
  }

  return extractedHeadings;
}

function innerslug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(
      /[^\w\u3131-\u314e\u314f-\u3163\uac00-\ud7a3\-]/g,
      '',
    ); // 한글 허용
}

// routes를 미리 계산하여 저장
const cachedRoutes = getActivePageRoutes();
const pathIndexMap = new Map(
  cachedRoutes.map((route, index) => [route.href, index]),
);

export function getPreviousNext(path: string) {
  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`;
  const index = pathIndexMap.get(normalizedPath);

  if (index === undefined || index === -1) {
    return { prev: null, next: null };
  }

  // getActivePageRoutes() 대신 캐시된 routes 사용
  const prev = index > 0 ? cachedRoutes[index - 1] : null;
  const next =
    index < cachedRoutes.length - 1
      ? cachedRoutes[index + 1]
      : null;

  return { prev, next };
}

const preCopy = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre') {
      const [codeEl] = node.children as Element[];
      if (codeEl?.tagName === 'code') {
        const textNode = codeEl.children?.[0] as Text;
        node.raw = textNode?.value || '';
      }
    }
  });
};

const postCopy = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre' && node.raw) {
      node.properties = node.properties || {};
      node.properties['raw'] = node.raw;
    }
  });
};
