const express = require("express");
const { keyBy } = require("lodash");
const ReportModel = require("../db/models/report");
const ReportDetailModel = require("../db/models/report-detail");
const { ObjectId } = require("mongoose").Types;

function router(io) {
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
      io.emit("newreport", savedReport);
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
        io.emit("updatedreport", updatedReport);
        return res.json(updatedReport);
      }
    );
  });

  reportsRouter.post("/details", async (req, res) => {
    const { body } = req;
    try {
      const reportDetail = new ReportDetailModel(body);
      const savedReportDetail = await reportDetail.save();
      io.emit("newdetail", savedReportDetail);
      res.json(savedReportDetail);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  reportsRouter.get("/details/:moduleName", async (req, res) => {
    const { params } = req;
    ReportDetailModel.find(
      { moduleName: params.moduleName },
      (err, reportDetail) => {
        if (err) return res.status(500).send(err);
        return res.json(reportDetail);
      }
    );
  });

  return reportsRouter;
}

module.exports = router;
