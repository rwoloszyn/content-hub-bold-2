// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { sentryVitePlugin } from "file:///home/project/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "your-org",
      project: "social-media-manager",
      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: {
        // Specify the directory containing build artifacts
        assets: "./dist/**",
        // Don't upload the source maps of dependencies
        ignore: ["node_modules"],
        // Don't fail if source maps can't be uploaded
        filesToDeleteAfterUpload: "./dist/**/*.map"
      }
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    sourcemap: true
    // Source map generation must be turned on
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSBcIkBzZW50cnkvdml0ZS1wbHVnaW5cIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgICAgb3JnOiBcInlvdXItb3JnXCIsXG4gICAgICBwcm9qZWN0OiBcInNvY2lhbC1tZWRpYS1tYW5hZ2VyXCIsXG4gICAgICAvLyBBdXRoIHRva2VucyBjYW4gYmUgb2J0YWluZWQgZnJvbSBodHRwczovL3NlbnRyeS5pby9zZXR0aW5ncy9hY2NvdW50L2FwaS9hdXRoLXRva2Vucy9cbiAgICAgIC8vIGFuZCBuZWVkcyB0aGUgYHByb2plY3Q6cmVsZWFzZXNgIGFuZCBgb3JnOnJlYWRgIHNjb3Blc1xuICAgICAgYXV0aFRva2VuOiBwcm9jZXNzLmVudi5TRU5UUllfQVVUSF9UT0tFTixcbiAgICAgIHRlbGVtZXRyeTogZmFsc2UsXG4gICAgICBzb3VyY2VtYXBzOiB7XG4gICAgICAgIC8vIFNwZWNpZnkgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIGJ1aWxkIGFydGlmYWN0c1xuICAgICAgICBhc3NldHM6IFwiLi9kaXN0LyoqXCIsXG4gICAgICAgIC8vIERvbid0IHVwbG9hZCB0aGUgc291cmNlIG1hcHMgb2YgZGVwZW5kZW5jaWVzXG4gICAgICAgIGlnbm9yZTogWydub2RlX21vZHVsZXMnXSxcbiAgICAgICAgLy8gRG9uJ3QgZmFpbCBpZiBzb3VyY2UgbWFwcyBjYW4ndCBiZSB1cGxvYWRlZFxuICAgICAgICBmaWxlc1RvRGVsZXRlQWZ0ZXJVcGxvYWQ6IFwiLi9kaXN0LyoqLyoubWFwXCIsXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gU291cmNlIG1hcCBnZW5lcmF0aW9uIG11c3QgYmUgdHVybmVkIG9uXG4gIH0sXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixTQUFTLHdCQUF3QjtBQUdqQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixpQkFBaUI7QUFBQSxNQUNmLEtBQUs7QUFBQSxNQUNMLFNBQVM7QUFBQTtBQUFBO0FBQUEsTUFHVCxXQUFXLFFBQVEsSUFBSTtBQUFBLE1BQ3ZCLFdBQVc7QUFBQSxNQUNYLFlBQVk7QUFBQTtBQUFBLFFBRVYsUUFBUTtBQUFBO0FBQUEsUUFFUixRQUFRLENBQUMsY0FBYztBQUFBO0FBQUEsUUFFdkIsMEJBQTBCO0FBQUEsTUFDNUI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUE7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
