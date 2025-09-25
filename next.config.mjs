const nextConfig = {
  output: "export", // 👈 enables static export (creates /out on build)
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true // 👈 required for static hosting (Hostinger has no image optimizer)
  }
};

export default nextConfig;
