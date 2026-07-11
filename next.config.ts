import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Tells Next.js to generate static files in an 'out' folder
  images: {
    unoptimized: true, // Required for static export targets
  },
  reactCompiler: true,
};

export default nextConfig;