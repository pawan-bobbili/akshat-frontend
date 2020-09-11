import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import "./App.css";
import Home from "./containers/Home/Home";
import Form from "./containers/Form/Form";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/form" component={Form} />
      </Switch>
    );
  }
}

export default withRouter(App);
