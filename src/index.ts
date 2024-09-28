import * as http from "http";
import * as dotenv from "dotenv";
import { startChat } from "./few_shot_encoding";

const server = http.createServer(async (req, res) => {
  dotenv.config();

  if (req.url == "/") {
    res.setHeader("Content-Type", "text/html");
    const articleUrlToSummarize =
      "https://www.linkedin.com/pulse/how-github-suggests-tags-your-repositories-saurav-prateek/";
    const response = await startChat(articleUrlToSummarize);

    res.end(response.postContent);
  }
});

server.listen(3000);
