import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["res.cloudinary.com"], // menambahkan Cloudinary sebagai domain gambar yang diizinkan
  },
};

export default nextConfig;
