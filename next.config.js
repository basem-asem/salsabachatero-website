/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', "media.istockphoto.com"],
  },
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
  },
}

module.exports = nextConfig
