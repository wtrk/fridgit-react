import React, { useState, Fragment } from "react";
import avatar from "assets/img/faces/marc.jpg";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import SidebarList from "./SidebarList";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import logo from "assets/img/logo.png";

const drawerWidth = 340;
const useStyles = makeStyles({
  list: {
    width: drawerWidth,
  },
  fullList: {
    width: "auto",
  },
});

export default function Sidebar(props) {
  const { routes } = props;
  const classes = useStyles();
  const [state, setState] = React.useState(false);
  const toggleDrawer = (pageName, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  const list = <SidebarList routes={routes} toggleDrawer={toggleDrawer} />;

  const brand = (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
        <div>
          <img className="avatarRounded" src={logo} alt="logo" />
        </div>
        <div style={{ paddingLeft: "5px" }}>Fridgit</div>
      </div>

      <Divider />
    </div>
  );
  return (
    <div className="headerSpacing">
      <Fragment key="left">
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(props.title, true)}
            >
              <FontAwesomeIcon icon={faBars} className="hamburgerBars" />
            </IconButton>
            <h3 className="pageTitle">{props.title}</h3>

            <div className="avatarCont">
              <div style={{ paddingRight: "5px" }}>
                {localStorage.getItem("Firstname") ? localStorage.getItem("Firstname") : "Tony"} &nbsp; 
                {localStorage.getItem("Lastname") ? localStorage.getItem("Lastname") : "Smith"}
              </div>
              <img className="avatarRounded" src={avatar} alt={localStorage.getItem("Firstname")} />
            </div>
          </Toolbar>
        </AppBar>
        <Button onClick={toggleDrawer(props.title, true)}>"left"</Button>
        <Drawer open={state} onClose={toggleDrawer(props.title, false)}>
          <div>{brand}</div>
          <Divider />
          {list}
        </Drawer>
      </Fragment>
    </div>
  );
}
