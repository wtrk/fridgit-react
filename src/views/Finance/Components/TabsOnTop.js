import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { getCookie } from 'components/auth/Helpers';
import axios from 'axios';

const TabsOnTopFromStatus = (props) => {
  const token = getCookie('token');

  /************ -Tabs START- **************/
  const handleChangeTabs = async (e, newIndex) => {
    const tabToFilter=e.target.attributes.name&&e.target.attributes.name.nodeValue!=="total"?`?tabs=${e.target.attributes.name.nodeValue}`:"";
    props.setIsLoading(true)
    await axios(`${process.env.REACT_APP_BASE_URL}/financial${tabToFilter}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`}
    }).then((response) => {
      props.setItems(response.data.data)
      props.setItemsBackup(response.data.data)
      props.setIsLoading(false)
    })
    .catch((error) => {
      console.log("error",error);
    });
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
        
      <Tab aria-controls="full-width-tabpanel-0" key="0" name="total"
        className="TabsOnTopFromStatus__tab" label={<><span name="total">All</span><div className="table-length-cont" name="total">{props.tabs.total}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-1" key="1" name="handling_in"
        className="TabsOnTopFromStatus__tab" label={<><span  name="handling_in">Handling&nbsp;IN/OUT</span><div className="table-length-cont" name="handling_in">{props.tabs.handling_in}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-2" key="2" name="storage"
        className="TabsOnTopFromStatus__tab" label={<><span name="storage">Storage</span><div className="table-length-cont" name="storage">{props.tabs.storage}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-3" key="3" name="in_house_preventive_maintenance"
        className="TabsOnTopFromStatus__tab" label={<><span name="in_house_preventive_maintenance">In&nbsp;House&nbsp;Prev</span><div className="table-length-cont" name="in_house_preventive_maintenance">{props.tabs.in_house_preventive_maintenance}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-4" key="4" name="corrective_service_in_house"
        className="TabsOnTopFromStatus__tab" label={<><span name="corrective_service_in_house">In&nbsp;House&nbsp;Corrective</span><div className="table-length-cont" name="corrective_service_in_house">{props.tabs.corrective_service_in_house}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-5" key="5" name="cabinet_testing_fees"
        className="TabsOnTopFromStatus__tab" label={<><span name="cabinet_testing_fees">Testing</span><div className="table-length-cont" name="cabinet_testing_fees">{props.tabs.cabinet_testing_fees}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-6" key="6" name="branding_fees"
        className="TabsOnTopFromStatus__tab" label={<><span name="branding_fees">Branding</span><div className="table-length-cont" name="branding_fees">{props.tabs.branding_fees}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-7" key="7" name="transportation_fees"
        className="TabsOnTopFromStatus__tab" label={<><span name="transportation_fees">Transportation</span><div className="table-length-cont" name="transportation_fees">{props.tabs.transportation_fees}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-8" key="8" name="drop"
        className="TabsOnTopFromStatus__tab" label={<><span name="drop">Drop</span><div className="table-length-cont" name="drop">{props.tabs.drop}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-9" key="9" name="preventive_maintenance"
        className="TabsOnTopFromStatus__tab" label={<><span name="preventive_maintenance">Preventive</span><div className="table-length-cont" name="preventive_maintenance">{props.tabs.preventive_maintenance}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-10" key="10" name="exchange_corrective_reaction"
        className="TabsOnTopFromStatus__tab" label={<><span name="exchange_corrective_reaction">Exchange&nbsp;Corrective</span><div className="table-length-cont" name="exchange_corrective_reaction">{props.tabs.exchange_corrective_reaction}</div></>}
      />
      <Tab aria-controls="full-width-tabpanel-11" key="11" name="corrective_reaction"
        className="TabsOnTopFromStatus__tab" label={<><span name="corrective_reaction">Corrective</span><div className="table-length-cont" name="corrective_reaction">{props.tabs.corrective_reaction}</div></>}
      />
      </Tabs>
    </AppBar>
  );
};
export default TabsOnTopFromStatus;
