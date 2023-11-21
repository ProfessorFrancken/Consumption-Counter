import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig(({mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [
      react(),
      legacy({
        targets: ["chrome 73"],
        polyfills: [
          "es.promise.finally",
          "es.promise.any",
          "es/map",
          "es/set",
          "es/array",
        ],
        modernPolyfills: true,
      }),
    ],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
