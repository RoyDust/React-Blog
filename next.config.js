/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 图片静态资源白名单
    domains: ['img-blog.csdnimg.cn']
  }
};
const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig)
