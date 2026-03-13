// Configuración completa de nuestro ssr de nuestro erp multiempresa para el renderizado del lado del servidor

import path from "node:path"
import fileSystem from "node:fs"

import { fileURLToPath } from "node:url"

import express from "express"
import { createServer as createViteServer } from "vite"

const port = process.env.PORT || 4000 

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer(){
   const app = express();

   const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
   });

   app.use(vite.middlewares)

   // server.ts
   app.get("*all", async (request, response, next) => {
      const url = request.originalUrl

      if (url.startsWith("/.well-known")) {
         return next(); 
      }

      try {
         let template = fileSystem.readFileSync(
            path.resolve(__dirname, "index.html"),
            "utf-8"
         )

         template = await vite.transformIndexHtml(url, template)

         // Obtenemos el metodo "render" de nuestro entrys-server.tsx
         const { render } = await vite.ssrLoadModule("/src/platform/EntryServer.tsx")

         const { appHtml, dehydratedState } = await render(url)

         const html = template
            .replace(`<!--ssr-outlet-->`, appHtml)
            .replace(
            `<!--ssr-state-->`,
            `<script>window.__REACT_QUERY_STATE__=${JSON.stringify(dehydratedState)}</script>`
            )

         response.status(200).set({ "Content-Type": "text/html" }).end(html)

      } catch (e) {
         vite.ssrFixStacktrace(e)
         next(e)
      }
   })

   app.listen(port, () => {
      console.log("server: http://localhost:" + port);
   })
}

createServer();