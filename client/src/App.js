import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./helpers/theme";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from "./common/layout";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <ThemeProvider theme={theme}>
          <Layout>
            <AppRoutes />
          </Layout>
        </ThemeProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
