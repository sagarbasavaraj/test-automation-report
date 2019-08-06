import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  link: {
    "text-decoration": "none",
    color: "inherit",
    "&:focus, &:hover, &:visited, &:link, &:active": {
      "text-decoration": "none",
      color: "inherit"
    }
  },
  title: {
    flexGrow: 1,
    "& > span:hover": {
      cursor: "pointer"
    }
  }
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" className={classes.link}>
          <Typography variant="h6" className={classes.title}>
            <span>Testautomation Report</span>
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
