import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/": index,
    "/tilemap_packed.png": Bun.file("./src/tilemap_packed.png"),
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,
    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
