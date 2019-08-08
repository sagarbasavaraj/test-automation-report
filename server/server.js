const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const reportsRouter = require("./routes/reports-router");
const ReportDb = require("./db/db");

const PORT = process.env.PORT || 5000;

class TestAutomationServer {
  async start() {
    const app = express();
    const server = http.createServer(app);

    const io = socketIo(server);
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use("/api/reports", reportsRouter(io));
    const reportDb = new ReportDb();
    await reportDb.connectDB();

    io.on("connection", socket => {
      console.log("client connected");
    });
    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on *:${PORT}`);
    });
  }
}

new TestAutomationServer().start();
