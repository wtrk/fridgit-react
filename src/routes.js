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
import { Switch, Route, Redirect } from "react-router-dom";
// @material-ui/icons
import {
  Dashboard,
  DynamicFeed,
  Person,
  LocalMall,
  LibraryBooks,
  AttachMoney,
  LocalAtmOutlined,
  Notifications,
  AccountBox,
  Assessment,
  Receipt,
  GroupAdd,
  Kitchen,
  GroupWork,
  LineStyle,
  Compare,
  Pageview,
  CallToAction,
  Apps,
  Public,
  LocationCity,
  AccountBalance,
  Store,
  FindReplace,
  SettingsApplications,
} from "@material-ui/icons";

// core components/views for Admin layout
import Signin from "views/Auth/Signin.js";
import Privilege from "views/Userrole/Privilege.js";
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Cabinets from "views/Cabinets/Cabinets.js";
import FinanceJobs from "views/Finance1/FinanceJobs.js";
import DailyReport from "views/Finance/DailyReport.js";
import FinanceReports from "views/Finance/FinanceReports.js";
import Country from "views/Country/Country.js";
import City from "views/City/City.js";
import Neighbourhood from "views/Neighbourhood/Neighbourhood.js";
import Price_rules from "views/Price_rules/Price_rules.js";
import Userrole from "views/Userrole/Userrole.js";
import Users from "views/Users/Users.js";
import ClientsList from "views/Clients/Clients_list.js";
import Allocation from "views/Allocation/Allocation.js";
import Tier from "views/Tier/Tier.js";
import ServiceType from "views/ServiceType/ServiceType.js";
import FridgesTypes from "views/FridgesTypes/FridgesTypes.js";
import Companies from "views/Companies/Companies.js";
import LiveOperation from "views/LiveOperation/LiveOperation.js";
import LiveOperationAdd from "views/LiveOperation/LiveOperationAdd.js";
import Pdf from "views/LiveOperation/Components/CustomToolbar/Components/Pdf.js";
import Warehouse from "views/Warehouse/Warehouse.js";
import SpareParts from "views/SpareParts/SpareParts.js";
import PreventiveAction from "views/PreventiveAction/PreventiveAction.js";
import CorrectiveInspections from "views/CorrectiveInspections/CorrectiveInspections.js";
import CorrectiveActions from "views/CorrectiveActions/CorrectiveActions.js";
import Stores from "views/Stores/Stores.js";

import Supplier from "views/Supplier/Supplier.js";
import Invoices from "views/Invoices/Invoices.js";
// import InvoicesPdf from "views/Invoices/InvoicesPdf.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import dashboardRoutes from "./dashboard-routes.json";

const switchRoutes = (
  <Switch>
  <Route
    path="/signin"
    component={Signin}
    key="Signin1"
  />
    <Route
      path="/admin/Privilege"
      component={Privilege}
      key="11111"
    />
    <Route
      path="/admin/LiveOperationAdd"
      component={LiveOperationAdd}
      key="2222"
    />
    {dashboardRoutes.map((e, i) => {
      if (e.layout === "/admin") {
        switch (e.name) {
          case "Operation":
            e.icon = Dashboard;
            e.component = DashboardPage;
            break;
          case "Live":
            e.icon = DynamicFeed;
            e.component = LiveOperation;
            break;
          case "Finance":
            e.icon = LocalAtmOutlined;
            e.component = TableList;
            break;
          case "Finance Jobs":
            e.icon = AttachMoney;
            e.component = FinanceJobs;
            break;
            case "Financial Report":
              e.icon = Assessment;
              e.component = FinanceReports;
              break;
          case "Daily Financial Reports":
            e.icon = Assessment;
            e.component = DailyReport;
            break;
          // case "Invoice":
          //   e.icon = Receipt;
          //   e.component = UserProfile;
          //   break;
            case "Invoices":
              e.icon = AccountBox;
              e.component = Invoices;
              break;
          case "Master Data":
            e.icon = LibraryBooks;
            e.component = Cabinets;
            break;
          case "Clients":
            e.icon = LocalMall;
            e.component = ClientsList;
            break;
          case "Cabinets":
            e.icon = Kitchen;
            e.component = Cabinets;
            break;
          case "Stores":
            e.icon = Store;
            e.component = Stores;
            break;
          case "Users":
            e.icon = Person;
            e.component = Users;
            break;
          case "User Roles":
            e.icon = GroupAdd;
            e.component = Userrole;
            break;
            case "Supplier":
              e.icon = AccountBox;
              e.component = Supplier;
              break;
          case "Warehouse":
            e.icon = GroupWork;
            e.component = Warehouse;
            break;
          case "Country":
            e.icon = Public;
            e.component = Country;
            break;
          case "City":
            e.icon = LocationCity;
            e.component = City;
            break;
          case "Neighbourhood":
            e.icon = AccountBalance;
            e.component = Neighbourhood;
            break;
          case "Allocation Rules":
            e.icon = LineStyle;
            e.component = Allocation;
            break;
          case "Tier":
            e.icon = FindReplace;
            e.component = Tier;
            break;
          case "Service Type":
            e.icon = SettingsApplications;
            e.component = ServiceType;
            break;
          case "Fridges Types":
            e.icon = Apps;
            e.component = FridgesTypes;
            break;
            case "Companies":
              e.icon = Apps;
              e.component = Companies;
              break;
          case "Spare Parts":
            e.icon = Compare;
            e.component = SpareParts;
            break;
            case "Preventive Actions":
              e.icon = Compare;
              e.component = PreventiveAction;
              break;
          case "Corrective Inspections":
            e.icon = Pageview;
            e.component = CorrectiveInspections;
            break;
          case "Corrective Actions":
            e.icon = CallToAction;
            e.component = CorrectiveActions;
            break;
          case "Price Rules":
            e.icon = Notifications;
            e.component = Price_rules;
            break;
            case "Pdf":
              e.icon = Dashboard;
              e.component = Pdf;
              break;
              // case "InvoicesPdf":
              //   e.icon = Dashboard;
              //   e.component = InvoicesPdf;
              //   break;
          default:
            e.icon = Dashboard;
            e.component = DashboardPage;
            break;
        }
        return (
          <Route path={e.layout + e.path} component={e.component} key={e._id}  />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

export default dashboardRoutes;
export { switchRoutes };
