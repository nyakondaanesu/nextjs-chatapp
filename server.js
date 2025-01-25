import express from "express";
import next from "next";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const startServer = async () => {
  try {
    await app.prepare();
    const server = express();

    server.get("/api/custom", (req, res) => {
      res.json({ message: "Custom route" });
    });

    //handle all other request using next
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    console.log(`can't start server error ${err}`);
  }
};

startServer();
