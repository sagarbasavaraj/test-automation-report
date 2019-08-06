import React from "react";
import { Route, Switch } from "react-router-dom";
import DashBoard from "./dashboard/dashboard";
import ReportDetails from "./reports-details/report-details";

const AppRoutes = () => (
  <Switch>
    <Route path="/" exact component={DashBoard} />
    <Route path="/reports/:id" component={ReportDetails} />
  </Switch>
);

export default AppRoutes;
