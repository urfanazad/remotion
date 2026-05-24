import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
});
