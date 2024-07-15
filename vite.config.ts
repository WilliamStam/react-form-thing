import {defineConfig, loadEnv} from "vite";
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default ({mode}: { mode: string }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // port: 3000,
      // host: "dsf.localhost",
      proxy: {
        // string shorthand
        
        "/api": {
          target: process.env.VITE_API,
          changeOrigin: true,
          secure: false,
          // ws: true,
        },
      }
    }
  })
}