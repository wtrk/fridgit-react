import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Moment from "react-moment";
import axios from 'axios';

const TabsOnTopFromStatus = (props) => {
  /************ -Tabs START- **************/

  const handleChangeTabs = async (event, newIndex) => {
    props.setTabIndex(newIndex);
  };
  /************ -Tabs END- **************/
  return (
    <AppBar position="static" color="default">
      <Tabs
        className="TabsOnTopFromStatus"
        value={props.tabIndex}
        onChange={handleChangeTabs}
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
      <Tab
        id="full-width-tab-0"
        aria-controls="full-width-tabpanel-0"
        key="0"
        className="TabsOnTopFromStatus__tab"
        label={
          <Fragment>
            <span>Detailed</span>
          </Fragment>
        }
      />
      <Tab
        id="full-width-tab-1"
        aria-controls="full-width-tabpanel-1"
        key="1"
        className="TabsOnTopFromStatus__tab"
        label={
          <Fragment>
            <span>Daily</span>
          </Fragment>
        }
      />
      </Tabs>
    </AppBar>
  );
};
export default TabsOnTopFromStatus;
