/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
//import RTL from "layouts/RTL.js";
import SignInSide from "components/login_comp/SignInSide.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import "./assets/css/global-styles.css";

const hist = createHashHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {/* <SignInSide /> */}
      <Route path="/login" exact component={SignInSide} key="2321341" />
      <Route path="/" component={Admin} key="212322" />

      {/* <Redirect from="/" to="/login" />     */}
    </Switch>
  </Router>,
  document.getElementById("root")
);
