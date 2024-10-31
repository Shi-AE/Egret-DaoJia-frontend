import { defineConfig } from 'vite'
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
    plugins: [
        uni()
    ],
    server: {
        "port": 3351,
        proxy: {
            "/api": {
                target: 'http://localhost:33500',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        }
    }
})
