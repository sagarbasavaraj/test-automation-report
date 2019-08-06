const express = require("express");
const { keyBy } = require("lodash");
const ReportModel = require("../db/models/report");

const reportsRouter = express.Router();

reportsRouter.get("/", (req, res) => {
  ReportModel.find((err, reports) => {
    if (err) return res.status(500).send(err);
    const reportsData = keyBy(reports, "_id");
    return res.json(reportsData);
  });
});

reportsRouter.post("/", async (req, res) => {
  const { body } = req;
  try {
    const report = new ReportModel(body);
    const savedReport = await report.save();
    res.json(savedReport);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

reportsRouter.get("/:id", (req, res) => {
  //get individual reports details
  console.log(req.params);
  res.send("getting report details");
});

module.exports = reportsRouter;
