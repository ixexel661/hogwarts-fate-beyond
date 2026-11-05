import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), viteReact()],
  server: {
    port: 3001,
  },
  environments: {
    ssr: {
      build: {
        // Rolldown can split the server bundle into chunks that import each other; keep module
        // evaluation in source order so top-level createMiddleware/createServerFn calls never
        // run before @tanstack/react-start has initialized.
        rolldownOptions: { output: { strictExecutionOrder: true } },
      },
    },
  },
});
