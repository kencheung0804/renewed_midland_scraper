import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "../components/App";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import UploadJson from "../components/UploadJson";

const Index = () => {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/upload_json" exact>
            <UploadJson />
          </Route>
        </Switch>
      </Router>
    );
  };


ReactDOM.render(<Index />, document.getElementById("app"));
