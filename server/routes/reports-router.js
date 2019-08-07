const express = require("express");
const { keyBy } = require("lodash");
const ReportModel = require("../db/models/report");
const { ObjectId } = require("mongoose").Types;

const reportsRouter = express.Router();

reportsRouter.get("/", (req, res) => {
  ReportModel.find({},
    "_id category moduleName buildNo total passed failed running",
    (err, reports) => {
      if (err) return res.status(500).send(err);
      const reportsData = keyBy(reports, "_id");
      return res.json(reportsData);
    }
  );
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
  const { params } = req;
  ReportModel.findById(ObjectId(params.id), (err, report) => {
    if (err) return res.status(500).send(err);
    return res.json(report);
  });
});

reportsRouter.put("/:id", (req, res) => {
  const { body, params } = req;
  ReportModel.findByIdAndUpdate(
    ObjectId(params.id),
    body,
    { new: true },
    (err, updatedReport) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.json(updatedReport);
    }
  );
});

module.exports = reportsRouter;
