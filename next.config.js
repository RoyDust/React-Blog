/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // distDir: "out/",
  // images: {
  // 图片静态资源白名单
  //   domains: ['img-blog.csdnimg.cn']
  // }
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const removeImports = require('next-remove-imports')();

module.exports = removeImports(withMDX(nextConfig))
