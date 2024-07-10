import { defineConfig } from 'vite'

export default defineConfig({
    build:{
        emptyOutDir: false,
        rollupOptions:{
        input:{
            background: "./lib/background.ts",
            content: "./lib/content.ts"
        },
        output:{
            entryFileNames: "assets/[name].js"
        }
        },
    },
})