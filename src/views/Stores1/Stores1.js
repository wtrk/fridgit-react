import React, { useState } from "react";
import { Container, TextField, Chip, Dialog, Slide } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {datatableTheme} from "assets/css/datatable-theme.js";
import dataJson from "./data.json";
import CustomToolbar from "../../CustomToolbar";
import AddFormDialog from "components/CustomComponents/AddFormDialog.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Stores = () => {
  const [openDialog, setOpenDialog] = useState(false); //for modal2
  const [items, setItems] = useState(dataJson); //table items
  
  /************ -Datatable START- **************/
  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar listener={handleAdd} />;
    },
  };
  const columns = [
    {
      name: "Code",
      label: "Code",
    },
    {
      name: "Name",
      label: "Name",
    },
    {
      name: "Branch",
      label: "Branch",
    },
    {
      name: "Branch Number",
      label: "Branch Number",
    },
    {
      name: "location",
      label: "Location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div style={{ width: 200 }}>
            <strong>City</strong>: {value ? value.City : "-"}
            <br />
            <strong>Area</strong>: {value ? value.Area : "-"}
            <br />
            <strong>Mobile</strong>: {value ? value.Mobile : "-"}
            <br />
          </div>
        ),
      },
    },
    {
      name: "finance",
      label: "Finance",
    },
    {
      name: "status",
      label: "Status",
    },
  ];
  /************ -Datatable END- **************/
  const top100Films = [];

  const handleAdd = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <div>
      <Container maxWidth="xl">
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
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label=""
              placeholder="Search in Code/Name/Branch number/Finance"
            />
          )}
        />
        <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
        />
        </MuiThemeProvider>
      </Container>

      <div>
        <Dialog
          fullScreen
          open={openDialog}
          onClose={handleCloseDialog}
          TransitionComponent={Transition}
        >
          <AddFormDialog
            title="Add Stores"
            handleClose={handleCloseDialog}
            inputs={[
              { labelText: "Image", type: "file" },
              { labelText: "Code", type: "text" },
              { labelText: "Name", type: "text" },
              { labelText: "Branch Name", type: "text" },
              { labelText: "Branch Number", type: "text" },
              { labelText: "Address", type: "text" },
              { labelText: "Phone", type: "text" },
              { labelText: "City", type: "text" },
              { labelText: "Neighbourbood", type: "text" },
            ]}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Stores;
