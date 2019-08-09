import React, { PureComponent } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  SnackbarContent,
  IconButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ErrorIcon from "@material-ui/icons/Error";
import clsx from "clsx";
import CloseIcon from "@material-ui/icons/Close";
import { get } from "../helpers/api";
import { get as _get } from "lodash";
import { socket } from "../helpers/api";

const snackBarAlign = {
  vertical: "top",
  horizontal: "center"
};

const styles = theme => ({
  root: {
    paddingTop: "75px",
    "min-height": "100vh"
  },
  button: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    textTransform: "none"
  },
  tableHeader: {
    backgroundColor: "#F1F4FB"
  },
  tableHeaderCell: {
    color: "#000000"
  },
  pass: {
    color: "#cee308"
  },
  success: {
    color: "#cee308"
  },
  fail: {
    color: "#995875"
  },
  title: {
    width: "30%"
  },
  spacer: {
    width: "20%"
  },
  info: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "10%"
  },
  total: {
    fontWeight: "bold"
  },
  passed: {
    fontWeight: "bold",
    color: "#cee308"
  },
  failed: {
    fontWeight: "bold",
    color: "#995875"
  },
  running: {
    fontWeight: "bold",
    color: "#B6B6B8"
  },
  table: {
    border: "1px solid #E0E0E0"
  },
  toolbar: {
    paddingLeft: "0px",
    paddingRight: "0px"
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
});

class ReportDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      report: {},
      reportDetails: [],
      loading: true,
      err: null
    };
  }

  handleChangeRowsPerPage = (event, action) => {
    const {
      props: { value }
    } = action;
    this.setState({ page: 0, rowsPerPage: value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  load = async () => {
    const { match } = this.props;
    try {
      const report = await get(`/reports/${match.params.id}`);
      const moduleName = _get(report, "moduleName");
      const reportDetails = await get(`/reports/details/${moduleName}`);
      this.setState({ report, reportDetails });
    } catch (err) {
      console.error(err);
      this.setState({ err });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateReport = report => {
    this.setState({ report });
  };

  updateReportDetail = reportDetail => {
    this.setState(state => ({
      reportDetails: state.reportDetails.concat(reportDetail)
    }));
  };

  componentDidMount() {
    this.load();
    socket.on("updatedreport", this.updateReport);
    socket.on("newdetail", this.updateReportDetail);
  }

  componentWillUnmount() {
    socket.off("updatedreport", this.updateReport);
    socket.off("newdetail", this.updateReportDetail);
  }

  handleErrorClose = () => {
    this.setState({ err: null });
  };

  render() {
    const {
      page,
      rowsPerPage,
      report,
      loading,
      reportDetails,
      err
    } = this.state;
    const { classes, history } = this.props;

    if (loading) {
      return (
        <Box
          className={classes.root}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="secondary" />
        </Box>
      );
    }

    return (
      <Container className={classes.root}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => history.push("/")}
        >
          <KeyboardArrowLeftIcon />
          Cockpit
        </Button>
        <Snackbar
          anchorOrigin={snackBarAlign}
          open={err !== null}
          onClose={this.handleErrorClose}
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
                onClick={this.handleErrorClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>
            ]}
          />
        </Snackbar>
        <Toolbar className={classes.toolbar}>
          <div className={classes.title}>
            <Typography variant="h6">{report.moduleName}</Typography>
          </div>
          <div className={classes.spacer} />
          <div className={classes.info}>
            <Typography>Total</Typography>
            <Typography className={classes.total}>{report.total}</Typography>
            <Typography>Passed</Typography>
            <Typography className={classes.passed}>{report.passed}</Typography>
            <Typography>Failed</Typography>
            <Typography className={classes.failed}>{report.failed}</Typography>
            <Typography>Running</Typography>
            <Typography className={classes.running}>
              {report.running}
            </Typography>
          </div>
        </Toolbar>
        <div>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  IP Address
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Build No.
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Smoke Suite Status
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Deployment Status
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Regression Suite Status
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{row.ipAddress}</TableCell>
                      <TableCell>{row.buildNo}</TableCell>
                      <TableCell className={classes[row.smokeStatus]}>
                        {row.smokeStatus}
                      </TableCell>
                      <TableCell className={classes[row.deploymentStatus]}>
                        {row.deploymentStatus}
                      </TableCell>
                      <TableCell className={classes[row.regressionStatus]}>
                        {row.regressionStatus}
                      </TableCell>
                      <TableCell className={classes[row.regressionStatus]}>
                        {row.datetime}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          count={reportDetails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Container>
    );
  }
}

export default withStyles(styles)(ReportDetails);
