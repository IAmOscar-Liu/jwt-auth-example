import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Header from "./Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bye from "./pages/Bye";

interface Props {}

const Routes: React.FC<Props> = ({}) => {
  return (
    <Router>
      <Header />
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/bye" component={Bye} />
        </Switch>
      </div>
    </Router>
  );
};
export default Routes;
