import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const TabsOnTopFromStatus = (props) => {
  /************ -Tabs START- **************/
  const dataLength = (status) => {
    const filteredObj =
      status.toUpperCase() === "ALL"
        ? props.items
        : props.items.filter((e) => {
            return e.status.toUpperCase() == status.toUpperCase();
          });
    return filteredObj.length;
  };
  const tabsTitle = [ 
    // ...new Set(props.items.map((e) => e.status)) ---- get unique status object from items
    "Operational","Needs Repair","Needs Test","Damaged","In Store","In Warehouse","Needs Preventive"
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
              <div className="TabsOnTopFromStatus__tab--number">{dataLength("All")}</div>
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
                <div className="table-length-cont">{dataLength(e)}</div>
              </Fragment>
            }
          />
        ))}
      </Tabs>
    </AppBar>
  );
};
export default TabsOnTopFromStatus;
