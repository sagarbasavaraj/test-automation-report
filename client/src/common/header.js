import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import DbLogo from "./db.png";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  link: {
    textDecoration: "none",
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
  },
  avatar: {
    borderRadius: "initial"
  }
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar>
        <Link to="/" className={classes.link}>
          <Typography variant="h5" className={classes.title}>
            <Box letterSpacing={1}>Testautomation Report</Box>
          </Typography>
        </Link>
        <div className={classes.grow} />
        <Avatar className={classes.avatar} alt="DB" src={DbLogo} />
      </Toolbar>
    </AppBar>
  );
}
