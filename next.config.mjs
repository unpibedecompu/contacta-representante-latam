/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export estático: `next build` genera `out/` con HTML/JS/CSS puro.
  // Se sirve desde el CDN de Cloudflare Pages (requests y ancho de banda
  // ilimitados en el plan free). No hay servidor ni funciones por request.
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
