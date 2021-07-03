import React, { Fragment,useState,useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from 'axios';

const TabsOnTopFromStatus = (props) => {
  const [countStatus,setCountStatus] = useState(0);
  const [countAll,setCountAll] = useState(0);
  
useEffect(() => {
  const fetchData = async () => {
    await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/count`, {
      responseType: "json",
    }).then((response) => {
      setCountStatus(response.data.data)
      setCountAll(response.data.total)
    })
    .catch((error) => {
      console.log("error",error);
    });
  };
  fetchData();
}, []);


  
  const tabsTitle = [ 
    "In Progress","Completed","Failed","On Hold","Assigned","Unassigned","Accepted","Canceled"
  ];
  const handleChangeTabs = (event, newIndex) => {
    let status = document.querySelector(`#full-width-tab-${newIndex}`)
      .firstChild.firstChild.textContent;
    props.setItemsFiltered(
      status.toUpperCase() === "ALL"
        ? props.items
        : props.items.filter((e) => {
            return e.status.toUpperCase() == status.toUpperCase();
          })
    );
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
              <span>All</span>
              <div className="TabsOnTopFromStatus__tab--number">{countAll}</div>
            </Fragment>
          }
        />
        {tabsTitle.map((e, i) => (
          <Tab
            id={`full-width-tab-${i + 1}`}
            aria-controls={`full-width-tabpanel-${i + 1}`}
            key={i + 1}
            className="tabs-text-color"
            label={
              <Fragment>
                <span>{e}</span>
                <div className="table-length-cont">{countStatus[e] || 0}</div>
              </Fragment>
            }
          />
        ))}
      </Tabs>
    </AppBar>
  );
};
export default TabsOnTopFromStatus;
