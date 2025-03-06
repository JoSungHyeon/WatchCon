import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /support/docs/install 같은 경로를 /support/ko/docs/install로 리다이렉트
  if (pathname.startsWith('/support/docs/')) {
    const newPath = pathname.replace(
      '/support/docs/',
      '/support/ko/docs/',
    );
    return NextResponse.redirect(
      new URL(newPath, request.url),
    );
  }

  if (pathname.startsWith('/support')) {
    if (
      !pathname.includes('/ko/') &&
      !pathname.includes('/en/')
    ) {
      // 쿠키에서 언어 설정 확인
      const languageCookie = request.cookies.get(
        'preferredLanguage',
      );
      let preferredLang = languageCookie?.value || 'ko';

      // KR을 ko로 변환
      if (preferredLang.toUpperCase() === 'KR') {
        preferredLang = 'ko';
      }

      // 유효한 언어값인지 확인
      if (!['ko', 'en'].includes(preferredLang)) {
        preferredLang = 'ko';
      }

      const localizedPath = pathname.replace(
        '/support/',
        `/support/${preferredLang}/`,
      );
      return NextResponse.redirect(
        new URL(localizedPath, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/support/:path*',
};
