import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { get } from "../helpers/api";

const DashBoard = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const reportsData = await get("/reports");
      setReports(reportsData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  console.log(reports);
  return <Container>DashBoard</Container>;
};

export default DashBoard;
