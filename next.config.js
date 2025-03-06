/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-datepicker'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withMDX(nextConfig);
