/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // エッジランタイムを使用
  experimental: {
    runtime: 'edge',
  },
}

module.exports = nextConfig 