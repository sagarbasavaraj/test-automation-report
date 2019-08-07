import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider
} from "@material-ui/core";
import { get } from "../helpers/api";
import { map } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import DonutChart from "../common/donut-chart";

const useStyles = makeStyles(theme => ({
  root: {
    "min-height": "100vh",
    background: "#001f4b"
  },
  reportItem: {
    background: "#173863",
    "&:hover": {
      cursor: "pointer"
    }
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto",
    "&:last-child": {
      "padding-bottom": "16px"
    }
  },
  footer: {
    "justify-content": "center",
    "align-items": "center"
  },
  color1: {
    color: "#627592"
  },
  color2: {
    color: "#c0cfdc"
  },
  passed: {
    color: "#cee308"
  },
  failed: {
    color: "#995875"
  },
  divider: {
    color: "#0f305b"
  },
  chart: {
    alignSelf: "center"
  }
}));

const DashBoard = ({ history }) => {
  const [reports, setReports] = useState([]);
  const classes = useStyles();
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

  return (
    <Box
      className={classes.root}
      px={3}
      py={10}
      component={Grid}
      container
      direction="row"
      spacing={1}
    >
      {map(reports, rep => {
        return (
          <Grid item xs={12} sm={3} key={rep._id}>
            <Card
              className={classes.reportItem}
              onClick={() => history.push(`/reports/${rep._id}`)}
            >
              <Grid container direction="row">
                <Grid item xs={9}>
                  <CardContent>
                    <Typography className={classes.color1} variant="subtitle1">
                      {rep.category}
                    </Typography>
                    <Typography
                      className={classes.color2}
                      component="h6"
                      variant="h6"
                    >
                      {rep.moduleName}
                    </Typography>
                    <Typography
                      className={classes.color1}
                      variant="subtitle2"
                      gutterBottom
                    >
                      {`Build No. ${rep.buildNo}`}
                    </Typography>
                  </CardContent>
                </Grid>
                <Grid item xs={3} className={classes.chart}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <DonutChart />
                  </Box>
                </Grid>
              </Grid>
              <Box px={2} pb={2}>
                <Divider className={classes.divider} />
              </Box>
              <Box pb={2}>
                <Grid direction="row" container className={classes.footer}>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.color1}
                      variant="subtitle2"
                      align="center"
                    >
                      Total
                    </Typography>
                    <Typography
                      className={classes.color2}
                      variant="subtitle1"
                      align="center"
                    >
                      {rep.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.color1}
                      variant="subtitle2"
                      align="center"
                    >
                      Passed
                    </Typography>
                    <Typography
                      className={classes.passed}
                      variant="subtitle1"
                      align="center"
                    >
                      {rep.passed}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.color1}
                      variant="subtitle2"
                      align="center"
                    >
                      Failed
                    </Typography>
                    <Typography
                      className={classes.failed}
                      variant="subtitle1"
                      align="center"
                    >
                      {rep.failed}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.color1}
                      variant="subtitle2"
                      align="center"
                    >
                      Running
                    </Typography>
                    <Typography
                      className={classes.color1}
                      variant="subtitle1"
                      align="center"
                    >
                      {rep.running}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Box>
  );
};

export default DashBoard;
