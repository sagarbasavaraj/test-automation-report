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
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { get } from "../helpers/api";
import { get as _get } from "lodash";

const styles = {
  root: {
    paddingTop: "75px"
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
  }
};

class ReportDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      report: null,
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

  componentDidMount() {
    const { match } = this.props;
    get(`/reports/${match.params.id}`)
      .then(res => {
        this.setState({ report: res, loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ err, loading: false });
      });
  }

  render() {
    const { page, rowsPerPage, report, loading } = this.state;
    const details = _get(report, "details") || [];
    const { classes, history } = this.props;

    if (loading) {
      return <div>Loading Report data....</div>;
    }

    return (
      <Container className={classes.root}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => history.push("/")}
        >
          Cockpit
        </Button>
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
              {report.runnung}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {details
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
          count={details.length}
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
