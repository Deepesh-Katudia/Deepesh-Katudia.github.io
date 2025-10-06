import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "https://github.com/Deepesh-Katudia/Deepesh-Katudia.github.io/tree/react-tic-tac-toe", // <-- repo name
});
