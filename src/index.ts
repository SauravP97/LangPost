import * as http from "http";
import * as dotenv from "dotenv";

const server = http.createServer(async (req, res) => {
    if (req.url == "/") {
        res.setHeader("Content-Type", "text/html");
        res.end("Welcome to LangPost");
    }
})

server.listen(3000);