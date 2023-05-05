// vite.config.ts
import { defineConfig } from "file:///Users/DanielWestbrook/Sites/CodePro/2023/docx-test/server/node_modules/.pnpm/vite@4.3.4_@types+node@18.16.3/node_modules/vite/dist/node/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { renderToString } from "file:///Users/DanielWestbrook/Sites/CodePro/2023/docx-test/server/node_modules/.pnpm/documentx@0.3.0/node_modules/documentx/dist/index.js";
import { createServer } from "file:///Users/DanielWestbrook/Sites/CodePro/2023/docx-test/server/node_modules/.pnpm/vite@4.3.4_@types+node@18.16.3/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/DanielWestbrook/Sites/CodePro/2023/docx-test/server/vite.config.ts";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
function ensureExists(path2) {
  if (!fs.existsSync(path2)) {
    fs.mkdirSync(path2, { recursive: true });
  }
  return path2;
}
var documentxPlugin = async () => {
  return [
    {
      name: "documentx-ssr-dev",
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const path2 = req.originalUrl;
            const filename = path2 === "/" ? "/index" : path2;
            const { default: App } = await server.ssrLoadModule(
              `${__dirname}/src/main.tsx`
            );
            const filePath = `${__dirname}/src/pages${filename}.tsx`;
            let html;
            if (!fs.existsSync(filePath)) {
              const notFoundPath = `${__dirname}/src/pages/404.tsx`;
              if (!fs.existsSync(notFoundPath))
                next();
              const { default: NotFound } = await server.ssrLoadModule(
                notFoundPath
              );
              html = renderToString(App({ children: NotFound({}) }));
            } else {
              const { default: Component } = await server.ssrLoadModule(
                filePath
              );
              html = renderToString(App({ children: Component({}) }));
            }
            let template = fs.readFileSync(`${__dirname}/index.html`, "utf-8");
            template = template.replace("<!--ssr-outlet-->", html);
            res.end(template);
          });
        };
      },
      config(config) {
        return {
          ...config,
          build: {
            ...config.build,
            outDir: ensureExists(
              path.join(path.resolve(__dirname, "dist"), "server")
            )
          }
        };
      },
      async buildEnd() {
        const vite = await createServer({
          server: { middlewareMode: true },
          appType: "custom"
        });
        const pagesDir = path.join(__dirname, "src", "pages");
        const files = fs.readdirSync(pagesDir);
        const { default: App } = await vite.ssrLoadModule(
          `${__dirname}/src/main.tsx`
        );
        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(pagesDir, file);
            const { default: Component } = await vite.ssrLoadModule(filePath);
            const html = renderToString(App({ children: Component({}) }));
            let template = fs.readFileSync(`${__dirname}/index.html`, "utf-8");
            template = template.replace("<!--ssr-outlet-->", html);
            const filename = file === "index.tsx" ? "index" : file.replace(".tsx", "");
            ensureExists(path.join(__dirname, "dist", "prerendered"));
            fs.writeFileSync(
              path.join(__dirname, "dist", "prerendered", `${filename}.html`),
              template
            );
          })
        );
        await vite.close();
      }
    }
  ];
};
var vite_config_default = defineConfig({
  plugins: [documentxPlugin()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvRGFuaWVsV2VzdGJyb29rL1NpdGVzL0NvZGVQcm8vMjAyMy9kb2N4LXRlc3Qvc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvRGFuaWVsV2VzdGJyb29rL1NpdGVzL0NvZGVQcm8vMjAyMy9kb2N4LXRlc3Qvc2VydmVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9EYW5pZWxXZXN0YnJvb2svU2l0ZXMvQ29kZVByby8yMDIzL2RvY3gtdGVzdC9zZXJ2ZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBQbHVnaW5PcHRpb24sIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IHJlbmRlciwgcmVuZGVyVG9TdHJpbmcgfSBmcm9tICdkb2N1bWVudHgnXG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tICd2aXRlJ1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKVxuXG5mdW5jdGlvbiBlbnN1cmVFeGlzdHMocGF0aDogc3RyaW5nKSB7XG4gIGlmICghZnMuZXhpc3RzU3luYyhwYXRoKSkge1xuICAgIGZzLm1rZGlyU3luYyhwYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICB9XG4gIHJldHVybiBwYXRoXG59XG5cbmNvbnN0IGRvY3VtZW50eFBsdWdpbiA9IGFzeW5jICgpOiBQcm9taXNlPFBsdWdpbk9wdGlvbltdPiA9PiB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgbmFtZTogJ2RvY3VtZW50eC1zc3ItZGV2JyxcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHJlcS5vcmlnaW5hbFVybFxuICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBwYXRoID09PSAnLycgPyAnL2luZGV4JyA6IHBhdGhcblxuICAgICAgICAgICAgLy8gTG9hZCByb290XG4gICAgICAgICAgICBjb25zdCB7IGRlZmF1bHQ6IEFwcCB9ID0gYXdhaXQgc2VydmVyLnNzckxvYWRNb2R1bGUoXG4gICAgICAgICAgICAgIGAke19fZGlybmFtZX0vc3JjL21haW4udHN4YFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAvLyBnZXQgcGF0aCB0byBmaWxlIGluIHNyYy9wYWdlc1xuICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBgJHtfX2Rpcm5hbWV9L3NyYy9wYWdlcyR7ZmlsZW5hbWV9LnRzeGBcblxuICAgICAgICAgICAgbGV0IGh0bWw6IHN0cmluZ1xuXG4gICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICAgIC8vIHJlbmRlciA0MDQgaHRtbFxuICAgICAgICAgICAgICBjb25zdCBub3RGb3VuZFBhdGggPSBgJHtfX2Rpcm5hbWV9L3NyYy9wYWdlcy80MDQudHN4YFxuICAgICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMobm90Rm91bmRQYXRoKSkgbmV4dCgpXG4gICAgICAgICAgICAgIGNvbnN0IHsgZGVmYXVsdDogTm90Rm91bmQgfSA9IGF3YWl0IHNlcnZlci5zc3JMb2FkTW9kdWxlKFxuICAgICAgICAgICAgICAgIG5vdEZvdW5kUGF0aFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIGh0bWwgPSByZW5kZXJUb1N0cmluZyhBcHAoeyBjaGlsZHJlbjogTm90Rm91bmQoe30pIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gcmVuZGVyIGh0bWxcbiAgICAgICAgICAgICAgY29uc3QgeyBkZWZhdWx0OiBDb21wb25lbnQgfSA9IGF3YWl0IHNlcnZlci5zc3JMb2FkTW9kdWxlKFxuICAgICAgICAgICAgICAgIGZpbGVQYXRoXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgaHRtbCA9IHJlbmRlclRvU3RyaW5nKEFwcCh7IGNoaWxkcmVuOiBDb21wb25lbnQoe30pIH0pKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXguaHRtbFxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vaW5kZXguaHRtbGAsICd1dGYtOCcpXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJzwhLS1zc3Itb3V0bGV0LS0+JywgaHRtbClcblxuICAgICAgICAgICAgLy8gc2VuZCBodG1sXG4gICAgICAgICAgICByZXMuZW5kKHRlbXBsYXRlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb25maWcoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICAuLi5jb25maWcuYnVpbGQsXG4gICAgICAgICAgICBvdXREaXI6IGVuc3VyZUV4aXN0cyhcbiAgICAgICAgICAgICAgcGF0aC5qb2luKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0JyksICdzZXJ2ZXInKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYXN5bmMgYnVpbGRFbmQodGhpcykge1xuICAgICAgICAvLyBjcmVhdGUgdml0ZSBzZXJ2ZXIgZm9yIHRyYW5zZm9ybWluZyBmaWxlc1xuICAgICAgICBjb25zdCB2aXRlID0gYXdhaXQgY3JlYXRlU2VydmVyKHtcbiAgICAgICAgICBzZXJ2ZXI6IHsgbWlkZGxld2FyZU1vZGU6IHRydWUgfSxcbiAgICAgICAgICBhcHBUeXBlOiAnY3VzdG9tJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBQcmVyZW5kZXIgaHRtbCBmcm9tIGZpbGVzIGluIHNyYy9wYWdlc1xuICAgICAgICBjb25zdCBwYWdlc0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdzcmMnLCAncGFnZXMnKVxuICAgICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHBhZ2VzRGlyKVxuXG4gICAgICAgIC8vIExvYWQgcm9vdFxuICAgICAgICBjb25zdCB7IGRlZmF1bHQ6IEFwcCB9ID0gYXdhaXQgdml0ZS5zc3JMb2FkTW9kdWxlKFxuICAgICAgICAgIGAke19fZGlybmFtZX0vc3JjL21haW4udHN4YFxuICAgICAgICApXG5cbiAgICAgICAgLy8gUmVuZGVyIHRvIHByZXJlbmRlcmVkIGZvbGRlclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICBmaWxlcy5tYXAoYXN5bmMgKGZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHBhZ2VzRGlyLCBmaWxlKVxuICAgICAgICAgICAgY29uc3QgeyBkZWZhdWx0OiBDb21wb25lbnQgfSA9IGF3YWl0IHZpdGUuc3NyTG9hZE1vZHVsZShmaWxlUGF0aClcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSByZW5kZXJUb1N0cmluZyhBcHAoeyBjaGlsZHJlbjogQ29tcG9uZW50KHt9KSB9KSlcblxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vaW5kZXguaHRtbGAsICd1dGYtOCcpXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJzwhLS1zc3Itb3V0bGV0LS0+JywgaHRtbClcblxuICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPVxuICAgICAgICAgICAgICBmaWxlID09PSAnaW5kZXgudHN4JyA/ICdpbmRleCcgOiBmaWxlLnJlcGxhY2UoJy50c3gnLCAnJylcblxuICAgICAgICAgICAgZW5zdXJlRXhpc3RzKHBhdGguam9pbihfX2Rpcm5hbWUsICdkaXN0JywgJ3ByZXJlbmRlcmVkJykpXG5cbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoXG4gICAgICAgICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICdkaXN0JywgJ3ByZXJlbmRlcmVkJywgYCR7ZmlsZW5hbWV9Lmh0bWxgKSxcbiAgICAgICAgICAgICAgdGVtcGxhdGVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KVxuICAgICAgICApXG5cbiAgICAgICAgYXdhaXQgdml0ZS5jbG9zZSgpXG5cbiAgICAgICAgLy8gRG8gYSBzZWNvbmQgYnVpbGQgdG8gY3JlYXRlIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gY29uc3Qgc2VydmVyRGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Rpc3QnLCAnc2VydmVyJylcbiAgICAgICAgLy8gYXdhaXQgdml0ZS5idWlsZCh7XG4gICAgICAgIC8vICAgc3NyOiB7fSxcbiAgICAgICAgLy8gfSlcbiAgICAgIH0sXG4gICAgfSxcbiAgXVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbZG9jdW1lbnR4UGx1Z2luKCldLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1csU0FBdUIsb0JBQW9CO0FBQzNZLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFFBQVE7QUFDZixTQUFpQixzQkFBc0I7QUFDdkMsU0FBUyxvQkFBb0I7QUFMK0wsSUFBTSwyQ0FBMkM7QUFPN1EsSUFBTSxZQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFFN0QsU0FBUyxhQUFhQSxPQUFjO0FBQ2xDLE1BQUksQ0FBQyxHQUFHLFdBQVdBLEtBQUksR0FBRztBQUN4QixPQUFHLFVBQVVBLE9BQU0sRUFBRSxXQUFXLEtBQUssQ0FBQztBQUFBLEVBQ3hDO0FBQ0EsU0FBT0E7QUFDVDtBQUVBLElBQU0sa0JBQWtCLFlBQXFDO0FBQzNELFNBQU87QUFBQSxJQUNMO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsUUFBUTtBQUN0QixlQUFPLE1BQU07QUFDWCxpQkFBTyxZQUFZLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUztBQUMvQyxrQkFBTUEsUUFBTyxJQUFJO0FBQ2pCLGtCQUFNLFdBQVdBLFVBQVMsTUFBTSxXQUFXQTtBQUczQyxrQkFBTSxFQUFFLFNBQVMsSUFBSSxJQUFJLE1BQU0sT0FBTztBQUFBLGNBQ3BDLEdBQUc7QUFBQSxZQUNMO0FBR0Esa0JBQU0sV0FBVyxHQUFHLHNCQUFzQjtBQUUxQyxnQkFBSTtBQUVKLGdCQUFJLENBQUMsR0FBRyxXQUFXLFFBQVEsR0FBRztBQUU1QixvQkFBTSxlQUFlLEdBQUc7QUFDeEIsa0JBQUksQ0FBQyxHQUFHLFdBQVcsWUFBWTtBQUFHLHFCQUFLO0FBQ3ZDLG9CQUFNLEVBQUUsU0FBUyxTQUFTLElBQUksTUFBTSxPQUFPO0FBQUEsZ0JBQ3pDO0FBQUEsY0FDRjtBQUNBLHFCQUFPLGVBQWUsSUFBSSxFQUFFLFVBQVUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFBQSxZQUN2RCxPQUFPO0FBRUwsb0JBQU0sRUFBRSxTQUFTLFVBQVUsSUFBSSxNQUFNLE9BQU87QUFBQSxnQkFDMUM7QUFBQSxjQUNGO0FBQ0EscUJBQU8sZUFBZSxJQUFJLEVBQUUsVUFBVSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUFBLFlBQ3hEO0FBR0EsZ0JBQUksV0FBVyxHQUFHLGFBQWEsR0FBRyx3QkFBd0IsT0FBTztBQUNqRSx1QkFBVyxTQUFTLFFBQVEscUJBQXFCLElBQUk7QUFHckQsZ0JBQUksSUFBSSxRQUFRO0FBQUEsVUFDbEIsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsTUFDQSxPQUFPLFFBQVE7QUFDYixlQUFPO0FBQUEsVUFDTCxHQUFHO0FBQUEsVUFDSCxPQUFPO0FBQUEsWUFDTCxHQUFHLE9BQU87QUFBQSxZQUNWLFFBQVE7QUFBQSxjQUNOLEtBQUssS0FBSyxLQUFLLFFBQVEsV0FBVyxNQUFNLEdBQUcsUUFBUTtBQUFBLFlBQ3JEO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLFdBQWU7QUFFbkIsY0FBTSxPQUFPLE1BQU0sYUFBYTtBQUFBLFVBQzlCLFFBQVEsRUFBRSxnQkFBZ0IsS0FBSztBQUFBLFVBQy9CLFNBQVM7QUFBQSxRQUNYLENBQUM7QUFHRCxjQUFNLFdBQVcsS0FBSyxLQUFLLFdBQVcsT0FBTyxPQUFPO0FBQ3BELGNBQU0sUUFBUSxHQUFHLFlBQVksUUFBUTtBQUdyQyxjQUFNLEVBQUUsU0FBUyxJQUFJLElBQUksTUFBTSxLQUFLO0FBQUEsVUFDbEMsR0FBRztBQUFBLFFBQ0w7QUFHQSxjQUFNLFFBQVE7QUFBQSxVQUNaLE1BQU0sSUFBSSxPQUFPLFNBQVM7QUFDeEIsa0JBQU0sV0FBVyxLQUFLLEtBQUssVUFBVSxJQUFJO0FBQ3pDLGtCQUFNLEVBQUUsU0FBUyxVQUFVLElBQUksTUFBTSxLQUFLLGNBQWMsUUFBUTtBQUNoRSxrQkFBTSxPQUFPLGVBQWUsSUFBSSxFQUFFLFVBQVUsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFNUQsZ0JBQUksV0FBVyxHQUFHLGFBQWEsR0FBRyx3QkFBd0IsT0FBTztBQUNqRSx1QkFBVyxTQUFTLFFBQVEscUJBQXFCLElBQUk7QUFFckQsa0JBQU0sV0FDSixTQUFTLGNBQWMsVUFBVSxLQUFLLFFBQVEsUUFBUSxFQUFFO0FBRTFELHlCQUFhLEtBQUssS0FBSyxXQUFXLFFBQVEsYUFBYSxDQUFDO0FBRXhELGVBQUc7QUFBQSxjQUNELEtBQUssS0FBSyxXQUFXLFFBQVEsZUFBZSxHQUFHLGVBQWU7QUFBQSxjQUM5RDtBQUFBLFlBQ0Y7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBRUEsY0FBTSxLQUFLLE1BQU07QUFBQSxNQU9uQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsZ0JBQWdCLENBQUM7QUFDN0IsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
