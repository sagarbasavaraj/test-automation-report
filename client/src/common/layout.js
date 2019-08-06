import React from "react";
import Header from "./header";
import { node } from "prop-types";

const Layout = ({ children }) => (
  <React.Fragment>
    <Header />
    {children}
  </React.Fragment>
);

Layout.propTypes = {
  children: node
};

export default Layout;
