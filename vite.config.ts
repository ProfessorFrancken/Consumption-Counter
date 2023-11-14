import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});