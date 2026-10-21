import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 같은 와이파이의 폰에서 맥 주소(http://192.168.x.x:3100)로 개발 서버를 열 수 있게 한다.
  // 개발 서버에만 쓰이는 설정이다(배포에는 영향 없음).
  allowedDevOrigins: ["192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
