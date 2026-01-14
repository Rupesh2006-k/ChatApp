import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
let server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use("/api/status", (req, res) => res.send("server is live"));

let PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("server is runing on port :", PORT);
});
