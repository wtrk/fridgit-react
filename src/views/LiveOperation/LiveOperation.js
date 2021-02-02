import React, { useState } from "react";
import {
  Container,
  Slide,
  Dialog,
  TextField,
  Chip,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CustomToolbar from "../../CustomToolbar";
import MUIDataTable from "mui-datatables";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";

import "react-dropzone-uploader/dist/styles.css";
import Autocomplete from "@material-ui/lab/Autocomplete";

import TabsOnTopFromStatus from "components/CustomComponents/TabsOnTopFromStatus.js";
import FilterComponent from "components/CustomComponents/FilterComponent.js";

import { useHistory } from "react-router-dom";
import "./LiveOperation.css";
import dataJson from "./LiveOperation.json";
import SnDialog from "./Components/SnDialog.js";
import OperationDialog from "./Components/OperationDialog.js";

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullWidthTabs() {
  let history = useHistory();
const [tabIndex,setTabIndex] = useState(0); //tabs tabIndex
const [items, setItems] = useState(dataJson); //table items
const [itemsFiltered,setItemsFiltered] = useState(); //table items
const [filterDialog,setFilterDialog] = useState(false);
const [openSnDialog,setOpenSnDialog] = useState(false);
const [openOperationDialog,setOpenOperationDialog] = useState(false);
  /************************* -Tabledata START- ***************************/
  const columns = [
    { name: "job_number", label: "Job #" },
    { name: "creation_date", label: "Creation Date" },
    {
      name: "operation_number",
      label: "Operation #",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a onClick={() => setOpenOperationDialog(true)}>{value}</a>
            </div>
          );
        },
      },
    },
    { name: "operation_type", label: "Operation Type" },
    {
      name: "sn",
      label: "Sn",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a onClick={() => setOpenSnDialog(true)}>{value}</a>
            </div>
          );
        },
      },
    },
    {
      name: "brand",
      label: "Brand",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div className="d-flex">
            <div className="avatar_circle">{value.substring(0, 2)}</div>
            {value}
          </div>
        ),
      },
    },
    { name: "client_name", label: "Client Name" },
    {
      name: "initiation_address",
      label: "Initiation Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div
            style={{
              width: 230,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="avatar_circle">{value.City.substring(0, 2)}</div>
            <div>
              {value ? value.City : "-"}
              <br />
              {value ? value.Area : "-"}
              <br />
              <strong>
                {value ? value.shop_name : "-"} / {value ? value.Mobile : "-"}
              </strong>
            </div>
          </div>
        ),
      },
    },
    {
      name: "execution_address",
      label: "Execution Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div
            style={{
              width: 230,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="avatar_circle">{value.City.substring(0, 2)}</div>
            <div>
              {value ? value.City : "-"}<br />
              {value ? value.Area : "-"}<br />
              <strong>{value ? value.shop_name : "-"} / {value ? value.Mobile : "-"}</strong>
            </div>
          </div>
        ),
      },
    },
    { name: "supplier", label: "Supplier" },
    { name: "client_approval", label: "Client Approval" },
    { name: "status", label: "Status" },
    { name: "last_status_user", label: "Last Status User" },
    { name: "last_status_update", label: "Last Status Update" },
    { name: "promise_date", label: "Promise Date" },
  ];
  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={handleOpenAddDialog}
          handleFilter={handleFilter}
        />
      );
    },
  };
  const handleOpenAddDialog = () => {
    //setOpenAddDialog(true);
    //let path = `/admin/LiveTransportation_1`;
    let path = `/admin/LiveOperationAdd`;
    history.push(path);
  };
  const handleFilter = () => {
    setFilterDialog(true);
  };
  /************************* -Tabledata END- ***************************/
  return (
    <div>
      <TabsOnTopFromStatus
        items={items}
        setItemsFiltered={setItemsFiltered}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
      <Container maxWidth="xl" style={{paddingTop:"4rem"}}>
        <Autocomplete
          multiple
          id="tags-filled"
          options={top100Films.map((option) => option.title)}
          defaultValue={[]}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({
                  index,
                })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label=""
              placeholder="Search Job Number/Operation Number/Serial Number"
            />
          )}
        />
        <MuiThemeProvider theme={datatableThemeInTabsPage}>
          <MUIDataTable
            title=""
            data={itemsFiltered ? itemsFiltered : items}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </Container>
      <div>
        {/*********************** -Operation Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth={true}
          TransitionComponent={Transition}
          open={openOperationDialog}
          onClose={() => setOpenOperationDialog(false)}
        >
          <OperationDialog setOpenDialog={setOpenOperationDialog} />
        </Dialog>

        {/*********************** -Sn Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth={true}
          TransitionComponent={Transition}
          open={openSnDialog}
          onClose={() => setOpenSnDialog(false)}
        >
          <SnDialog setOpenDialog={setOpenSnDialog} />
        </Dialog>

        {/*********************** -FILTER START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth={true}
          TransitionComponent={Transition}
          open={filterDialog}
          onClose={() => setFilterDialog(false)}
        >
          <FilterComponent setOpenDialog={setFilterDialog} />
        </Dialog>
      </div>
    </div>
  );
}
