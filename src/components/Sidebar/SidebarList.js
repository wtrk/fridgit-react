import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {signout,isAuth} from "components/auth/Helpers.js";

import Collapse from "@material-ui/core/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  selected: {
    paddingLeft: theme.spacing(4),
    color: "#007bff !important",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  selectedMain: {
    color: "#007bff !important",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

export default function SidebarList(props) {
  const currentPath = `/${window.location.href.split("/").slice(-1)[0]}`;
  const classes = useStyles();
  const [openSidebar, setOpenSidebar] = React.useState({
    Operation: false,
    Finance: false,
    "Master Data": false,
  });
  const handleOpenChild = (index) => {
    setOpenSidebar({
      Operation: false,
      Finance: false,
      "Master Data": false,
      [index]: !openSidebar[index],
    });
  };
  return (
    <div className={classes.root}>
      <div className="all-links-cont">
        {props.routes.map((e, i) => {
          return e.type === "Main" ? (
            e.haschild === true ? (
              <ListItem button onClick={() => handleOpenChild(e.name)}  key={e._id}>
                <ListItemIcon>
                  <e.icon />
                </ListItemIcon>
                <ListItemText primary={e.name} />
                <FontAwesomeIcon
                  icon={openSidebar[e.name] ? faChevronUp : faChevronDown}
                  className="menu-expcol"
                />
              </ListItem>
            ) : (
              <NavLink to={e.layout + e.path} className={classes.item} key={e._id}>
                <ListItem
                  
                  button
                  onClick={props.toggleDrawer(e.name, false)}
                  className={currentPath === e.path ? classes.selectedMain : ""}
                >
                  <ListItemIcon>
                    <e.icon />
                  </ListItemIcon>
                  <ListItemText primary={e.name} />
                </ListItem>
              </NavLink>
            )
          ) : (
            <NavLink to={e.layout + e.path} className={classes.item} key={e._id}>
              <Collapse in={openSidebar[e.parent]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                  
                    button
                    onClick={props.toggleDrawer(e.name, false)}
                    className={
                      currentPath === e.path ? classes.selected : classes.nested
                    }
                  >
                    <ListItemIcon>
                      <e.icon />
                    </ListItemIcon>
                    <ListItemText primary={e.name} />
                  </ListItem>
                </List>
              </Collapse>
            </NavLink>
          );
        })}
      </div>
      <List
        component="nav"
        aria-label="secondary mailbox folders"
        className="signout-cont__btn"
      >
        <ListItem button onClick={()=>{
          signout(()=>{
            props.history.push("/signin")
          })
        }} key="122311132">
          <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
          <ListItemText primary="Signout" />
        </ListItem>
      </List>
    </div>
  );
}
