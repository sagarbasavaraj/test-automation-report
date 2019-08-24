import React, { useReducer, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
  Snackbar,
  IconButton,
  SnackbarContent
} from "@material-ui/core";
import { get } from "../helpers/api";
import { map } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import clsx from "clsx";
import Immutable from "seamless-immutable";
import CloseIcon from "@material-ui/icons/Close";
import DonutChart from "../common/donut-chart";
import { socket } from "../helpers/api";

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
  },
  grow: {
    flexGrow: 1
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

const initialState = Immutable({ reports: {}, loading: true, err: null });

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_REPORTS":
      return state.set("reports", payload.reports);
    case "SET_REPORT":
      return state.setIn(["reports", payload.report._id], payload.report);
    case "SET_LOADER_STATUS": {
      return state.set("loading", payload);
    }
    case "SET_ERROR": {
      return state.set("err", payload.err);
    }
    case "CLEAR_ERROR": {
      return state.set("err", null);
    }
    default:
      return state;
  }
}
const snackBarAlign = {
  vertical: "top",
  horizontal: "center"
};

const DashBoard = ({ history }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();

  const fetchReports = async () => {
    try {
      const reports = await get("/reports");
      dispatch({ type: "SET_REPORTS", payload: { reports } });
      dispatch({ type: "SET_LOADER_STATUS", payload: true });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: { err } });
    } finally {
      dispatch({ type: "SET_LOADER_STATUS", payload: false });
    }
  };

  const updateReport = report => {
    console.log(report);
    dispatch({ type: "SET_REPORT", payload: { report } });
  };

  useEffect(() => {
    fetchReports();
    socket.on("updatedreport", updateReport);
    socket.on("newreport", updateReport);
    //clean up if component is getting unmounted.
    return () => {
      socket.off("updatedreport", updateReport);
      socket.off("newreport", updateReport);
    };
  }, []);

  const handleErrorClose = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const { reports, loading, err } = state;

  if (loading) {
    return (
      <Box
        className={classes.root}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={3}
        pt={10}
        pb={3}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box px={3} pt={10} pb={3} className={classes.root}>
      <Grid container direction="row" spacing={1}>
        <Snackbar
          anchorOrigin={snackBarAlign}
          open={err !== null}
          onClose={handleErrorClose}
        >
          <SnackbarContent
            className={classes.error}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar" className={classes.message}>
                <ErrorIcon
                  className={clsx(classes.icon, classes.iconVariant)}
                />
                Error in fetching report.
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={handleErrorClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>
            ]}
          />
        </Snackbar>
        {map(reports, rep => {
          const totalComp = ((rep.passed + rep.failed) / rep.total) * 100;
          const completedPercentage = Math.round(totalComp);
          return (
            <Grid item xs={12} sm={5} md={4} lg={3} key={rep._id}>
              <Card
                className={classes.reportItem}
                onClick={() => history.push(`/reports/${rep._id}`)}
              >
                <Grid container direction="row">
                  <Grid item className={classes.grow}>
                    <CardContent>
                      <Typography
                        className={classes.color1}
                        variant="subtitle1"
                      >
                        {rep.category}
                      </Typography>
                      <Typography
                        className={classes.color2}
                        component="h6"
                        variant="h6"
                        noWrap
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
                  <Grid item className={classes.chart}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      pr={2}
                    >
                      <DonutChart
                        value={completedPercentage}
                        status={rep.failed ? "red" : "success"}
                      />
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
      </Grid>
    </Box>
  );
};

export default DashBoard;
