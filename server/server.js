const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const reportsRouter = require("./routes/reports-router");
const ReportDb = require("./db/db");

const PORT = process.env.PORT || 5000;

class TestAutomationServer {
  async start() {
    const app = express();
    const reportDb = new ReportDb();
    await reportDb.connectDB();
    
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use("/api/reports", reportsRouter);

    app.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  }
}

new TestAutomationServer().start();
