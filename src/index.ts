import * as http from "http";
import * as dotenv from "dotenv";
import { fewShotEncoding } from "./few_shot_encoding";

const server = http.createServer(async (req, res) => {
  dotenv.config();
  
  if (req.url == "/") {
    res.setHeader("Content-Type", "text/html");
    const content = await fewShotEncoding();
    res.end(content);
  }
});

server.listen(3000);
