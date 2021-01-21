import React, { useState } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Slide,
  TextField,
  Chip,
  Dialog,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import MUIDataTable from "mui-datatables";
import datatableTheme from "assets/css/datatable-theme.js";
import AddOperationForm from "./Components/AddOperationForm.js";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LiveOperationAdd = () => {
  const [items, setItems] = useState(); //table items
  const [openAddDialog,setOpenAddDialog] = useState(false); //for modal
  const columns = [
    {name:"sn", label:"sn"},
    {name:"ref", label:"ref"},
    {name:"type", label:"type"},
    {name:"brand", label:"brand"},
    {name:"client", label:"client"},
    {name:"shop", label:"shop"},
    {name:"supplier", label:"supplier"},
    {name:"warehouse", label:"warehouse"},
    {name:"operation", label:"operation"}
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar listener={handleOpenAddDialog} />
      );
    },
  };
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  return (
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
            placeholder="Search Data"
          />
        )}
      />

      <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
          className="dataTableContainer"
        />
      </MuiThemeProvider>

      <div>
          
        {/*********************** -Add START- ****************************/}
        <Dialog
          maxWidth={"lg"}
          fullWidth={true}
          TransitionComponent={Transition}
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
        >
          <div style={{minHeight:"80vh",overflowX:"hidden"}}>
          <AddOperationForm setOpenDialog={setOpenAddDialog} />
          </div>
        </Dialog>

      </div>
    </Container>
  );
}
export default LiveOperationAdd;