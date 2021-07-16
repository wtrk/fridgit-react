import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes, { switchRoutes } from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo.png";
import { Redirect } from "react-router-dom";
import {isAuth} from "components/auth/Helpers.js";
import dashboardRoutes from "dashboard-routes.json";

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  let title=""
  let currentPath=`/${window.location.href.split("/").pop()}`
  dashboardRoutes.forEach(routeDetails => {
    if(routeDetails.path===currentPath){
      title=routeDetails.name
    }
  });
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image] = useState(bgImage);
  const [color] = useState("blue");
  const [mobileOpen] = useState(false);

  return (isAuth()?
    <div className={classes.wrapper}>
      <Sidebar
      title={title}
        routes={routes}
        image={image}
        handleDrawerToggle={mobileOpen}
        open={mobileOpen}
        color={color}
        {...rest}
      />

      <div ref={mainPanel}>
        <div className={classes.map}>{switchRoutes} </div>
      </div>
    </div>:<Redirect to="/signin" />);
}
